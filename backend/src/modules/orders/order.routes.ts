import { Router } from "express";
import { Response } from "express";
import { prisma } from "../../config/database";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin, requireCustomer } from "../../middleware/role.middleware";
import { sendSuccess, sendError, generateOrderNumber } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth.middleware";
import { upload, getFileUrl } from "../../middleware/upload.middleware";

const router = Router();

// Customer — place order
router.post("/", authenticate, requireCustomer, async (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, notes, companyId } = req.body;
    // Calculate totals
    let subtotal = 0;
    const orderItems: any[] = [];
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
      subtotal += product.price * item.quantity;
      orderItems.push({ productId: item.productId, quantity: item.quantity, price: product.price });
      // Decrement stock
      await prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
    }
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId:  req.user!.userId,
        companyId,
        subtotal,
        total:       subtotal + 1500, // flat shipping
        shippingFee: 1500,
        shippingAddress,
        notes,
        items: { create: orderItems },
      },
      include: { items: { include: { product: { include: { images: true } } } } },
    });
    sendSuccess(res, order, "Order placed successfully", 201);
  } catch (err: any) { sendError(res, err.message); }
});

router.get("/my", authenticate, requireCustomer, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query as any;
    const where = { customerId: req.user!.userId };
    const [data, total] = await Promise.all([
      prisma.order.findMany({ where, skip: (+page - 1) * +limit, take: +limit, include: { items: { include: { product: { include: { images: true } } } } }, orderBy: { createdAt: "desc" } }),
      prisma.order.count({ where }),
    ]);
    sendSuccess(res, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
  } catch (err: any) { sendError(res, err.message); }
});

router.post("/:id/payment", authenticate, requireCustomer, upload.single("proof"), async (req: AuthRequest, res: Response) => {
  if (!req.file) { sendError(res, "No file uploaded"); return; }
  try {
    const url   = getFileUrl(req, req.file.filename);
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { paymentProofUrl: url } });
    sendSuccess(res, order, "Payment proof uploaded");
  } catch (err: any) { sendError(res, err.message); }
});

// Admin — view and manage orders
router.get("/company", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query as any;
    const where: any = { companyId: req.user!.companyId! };
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      prisma.order.findMany({ where, skip: (+page - 1) * +limit, take: +limit, include: { items: { include: { product: true } }, customer: { select: { name: true, email: true, phone: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.order.count({ where }),
    ]);
    sendSuccess(res, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
  } catch (err: any) { sendError(res, err.message); }
});

router.patch("/:id/status", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    sendSuccess(res, order, "Order status updated");
  } catch (err: any) { sendError(res, err.message); }
});

export default router;
