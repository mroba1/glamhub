import { Router, Response } from "express";
import { prisma } from "../../config/db";
import { ok, fail, slugify } from "../../utils";
import { authenticate, isAdmin, isSuperAdmin, Req } from "../../middleware/auth";
import { upload, fileUrl } from "../../middleware/upload";

const router = Router();

// Public — browse products for a company
router.get("/public/:companyId", async (req, res) => {
  try {
    const { search, categoryId, page = 1, limit = 20 } = req.query as any;
    const where: any = { companyId: req.params.companyId, status: "ACTIVE" };
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (categoryId) where.categoryId = categoryId;
    const [data, total] = await Promise.all([
      prisma.product.findMany({ where, skip: (+page - 1) * +limit, take: +limit, include: { images: true, category: true }, orderBy: { createdAt: "desc" } }),
      prisma.product.count({ where }),
    ]);
    ok(res, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
  } catch (e: any) { fail(res, e.message); }
});

// Public — single product
router.get("/public/:companyId/:id", async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id: req.params.id, companyId: req.params.companyId },
      include: { images: true, category: true },
    });
    if (!product) return fail(res, "Not found", 404);
    ok(res, product);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — get own products
router.get("/", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { companyId: req.user!.companyId! },
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
    });
    ok(res, products);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — create product
router.post("/", authenticate, isAdmin, upload.array("images", 5), async (req: Req, res: Response) => {
  try {
    const files = (req.files as any[]) || [];
    const images = files.map((f: any, i: number) => ({ url: fileUrl(req, f.filename), isPrimary: i === 0 }));
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
    ok(res, product, "Product created", 201);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — update product
router.patch("/:id", authenticate, isAdmin, upload.array("images", 5), async (req: Req, res: Response) => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.companyId !== req.user!.companyId!) return fail(res, "Not found", 404);
    const files = (req.files as any[]) || [];
    const images = files.map((f: any, i: number) => ({ url: fileUrl(req, f.filename), isPrimary: i === 0 }));
    const { price, compareAtPrice, stock, tags, name, ...rest } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...rest, ...(name && { name, slug: slugify(name) }),
        ...(price && { price: +price }), ...(compareAtPrice && { compareAtPrice: +compareAtPrice }),
        ...(stock && { stock: +stock }), ...(tags && { tags: JSON.parse(tags) }),
        ...(images.length && { images: { create: images } }),
      },
      include: { images: true, category: true },
    });
    ok(res, product, "Product updated");
  } catch (e: any) { fail(res, e.message); }
});

// Admin — delete product
router.delete("/:id", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const existing = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.companyId !== req.user!.companyId!) return fail(res, "Not found", 404);
    await prisma.product.delete({ where: { id: req.params.id } });
    ok(res, null, "Product deleted");
  } catch (e: any) { fail(res, e.message); }
});

// Super Admin — moderate product
router.patch("/:id/moderate", authenticate, isSuperAdmin, async (req: Req, res: Response) => {
  try {
    const product = await prisma.product.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    ok(res, product, "Product moderated");
  } catch (e: any) { fail(res, e.message); }
});

export default router;
