import { Router } from "express";
import { Response } from "express";
import { prisma } from "../../config/database";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin, requireSuperAdmin } from "../../middleware/role.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth.middleware";
import { upload, getFileUrl } from "../../middleware/upload.middleware";
import { slugify } from "../../utils/response";

const router = Router();

// Public — browse products for a company
router.get("/company/:companyId", async (req, res) => {
  try {
    const { search, categoryId, page = 1, limit = 20 } = req.query as any;
    const where: any = { companyId: req.params.companyId, status: "ACTIVE" };
    if (search)     where.name       = { contains: search, mode: "insensitive" };
    if (categoryId) where.categoryId = categoryId;
    const [data, total] = await Promise.all([
      prisma.product.findMany({ where, skip: (+page - 1) * +limit, take: +limit, include: { images: true, category: true }, orderBy: { createdAt: "desc" } }),
      prisma.product.count({ where }),
    ]);
    sendSuccess(res, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
  } catch (err: any) { sendError(res, err.message); }
});

router.get("/company/:companyId/:id", async (req, res) => {
  try {
    const product = await prisma.product.findFirst({ where: { id: req.params.id, companyId: req.params.companyId }, include: { images: true, category: true } });
    if (!product) { sendError(res, "Product not found", 404); return; }
    sendSuccess(res, product);
  } catch (err: any) { sendError(res, err.message); }
});

// Admin — manage own products
router.get("/", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { companyId: req.user!.companyId! },
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
    });
    sendSuccess(res, products);
  } catch (err: any) { sendError(res, err.message); }
});

router.post("/", authenticate, requireAdmin, upload.array("images", 5), async (req: AuthRequest, res: Response) => {
  try {
    const files  = (req.files as Express.Multer.File[]) ?? [];
    const images = files.map((f, i) => ({ url: getFileUrl(req, f.filename), isPrimary: i === 0 }));
    const { name, description, price, compareAtPrice, stock, sku, categoryId, tags } = req.body;
    const product = await prisma.product.create({
      data: {
        name, description, price: +price, compareAtPrice: compareAtPrice ? +compareAtPrice : undefined,
        stock: +stock, sku, categoryId, companyId: req.user!.companyId!,
        slug: slugify(name), tags: tags ? JSON.parse(tags) : [],
        images: { create: images },
      },
      include: { images: true, category: true },
    });
    sendSuccess(res, product, "Product created", 201);
  } catch (err: any) { sendError(res, err.message); }
});

router.patch("/:id", authenticate, requireAdmin, upload.array("images", 5), async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.companyId !== req.user!.companyId!) { sendError(res, "Not found", 404); return; }
    const files  = (req.files as Express.Multer.File[]) ?? [];
    const images = files.map((f, i) => ({ url: getFileUrl(req, f.filename), isPrimary: i === 0 }));
    const { price, compareAtPrice, stock, tags, ...rest } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        ...(price           && { price: +price }),
        ...(compareAtPrice  && { compareAtPrice: +compareAtPrice }),
        ...(stock           && { stock: +stock }),
        ...(tags            && { tags: JSON.parse(tags) }),
        ...(images.length   && { images: { create: images } }),
      },
      include: { images: true, category: true },
    });
    sendSuccess(res, product, "Product updated");
  } catch (err: any) { sendError(res, err.message); }
});

router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.companyId !== req.user!.companyId!) { sendError(res, "Not found", 404); return; }
    await prisma.product.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, "Product deleted");
  } catch (err: any) { sendError(res, err.message); }
});

// Super admin — moderate
router.patch("/:id/moderate", authenticate, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const product = await prisma.product.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    sendSuccess(res, product, "Product status updated");
  } catch (err: any) { sendError(res, err.message); }
});

export default router;
