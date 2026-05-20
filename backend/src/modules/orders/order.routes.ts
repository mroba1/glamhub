import { Router, Response } from "express";
import { prisma } from "../../config/db";
import { ok, fail, generateOrderNumber } from "../../utils";
import { authenticate, isAdmin, isCustomer, Req } from "../../middleware/auth";
import { upload, fileUrl } from "../../middleware/upload";

const router = Router();

// Customer — place order
router.post("/", authenticate, isCustomer, async (req: Req, res: Response) => {
  try {
    const { items, shippingAddress, notes, companyId } = req.body;
    let subtotal = 0;
    const orderItems: any[] = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock: ${product.name}`);
      subtotal += product.price * item.quantity;
      orderItems.push({ productId: item.productId, quantity: item.quantity, price: product.price });
      await prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
    }
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(), customerId: req.user!.userId, companyId,
        subtotal, total: subtotal + 1500, shippingFee: 1500, shippingAddress, notes,
        items: { create: orderItems },
      },
      include: { items: { include: { product: { include: { images: true } } } } },
    });
    ok(res, order, "Order placed", 201);
  } catch (e: any) { fail(res, e.message); }
});

// Customer — get my orders
router.get("/my", authenticate, isCustomer, async (req: Req, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query as any;
    const where = { customerId: req.user!.userId };
    const [data, total] = await Promise.all([
      prisma.order.findMany({ where, skip: (+page - 1) * +limit, take: +limit, include: { items: { include: { product: { include: { images: true } } } } }, orderBy: { createdAt: "desc" } }),
      prisma.order.count({ where }),
    ]);
    ok(res, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
  } catch (e: any) { fail(res, e.message); }
});

// Customer — upload payment proof
router.post("/:id/payment", authenticate, isCustomer, upload.single("proof"), async (req: Req, res: Response) => {
  if (!req.file) return fail(res, "No file");
  try {
    const url = fileUrl(req, req.file.filename);
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { paymentProofUrl: url } });
    ok(res, order, "Payment proof uploaded");
  } catch (e: any) { fail(res, e.message); }
});

// Admin — get company orders
router.get("/company", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query as any;
    const where: any = { companyId: req.user!.companyId! };
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      prisma.order.findMany({ where, skip: (+page - 1) * +limit, take: +limit, include: { items: { include: { product: true } }, customer: { select: { name: true, email: true, phone: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.order.count({ where }),
    ]);
    ok(res, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
  } catch (e: any) { fail(res, e.message); }
});

// Admin — update order status
router.patch("/:id/status", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    ok(res, order, "Order updated");
  } catch (e: any) { fail(res, e.message); }
});

export default router;
