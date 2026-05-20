import { Router, Response } from "express";
import { prisma } from "../../config/db";
import { ok, fail, slugify, normalizeCategory } from "../../utils";
import { authenticate, isAdmin, isSuperAdmin, Req } from "../../middleware/auth";

const router = Router();

// Public — global categories
router.get("/global", async (_req, res) => {
  try {
    const cats = await prisma.category.findMany({ where: { isGlobal: true, isActive: true }, orderBy: { name: "asc" } });
    ok(res, cats);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — get own + global categories
router.get("/", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const cats = await prisma.category.findMany({
      where: { OR: [{ isGlobal: true }, { companyId: req.user!.companyId! }], isActive: true },
      orderBy: { name: "asc" },
    });
    ok(res, cats);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — create category
router.post("/", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const slug = slugify(normalizeCategory(req.body.name));
    const exists = await prisma.category.findFirst({ where: { slug, companyId: req.user!.companyId! } });
    if (exists) return fail(res, "Category already exists");
    const cat = await prisma.category.create({ data: { name: req.body.name, slug, companyId: req.user!.companyId! } });
    ok(res, cat, "Category created", 201);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — delete own category
router.delete("/:id", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.companyId !== req.user!.companyId!) return fail(res, "Not found", 404);
    await prisma.category.delete({ where: { id: req.params.id } });
    ok(res, null, "Category deleted");
  } catch (e: any) { fail(res, e.message); }
});

// Super Admin — create global category
router.post("/global", authenticate, isSuperAdmin, async (req: Req, res: Response) => {
  try {
    const slug = slugify(normalizeCategory(req.body.name));
    const exists = await prisma.category.findFirst({ where: { slug, isGlobal: true } });
    if (exists) return fail(res, "Global category already exists");
    const cat = await prisma.category.create({ data: { name: req.body.name, slug, isGlobal: true } });
    ok(res, cat, "Global category created", 201);
  } catch (e: any) { fail(res, e.message); }
});

// Super Admin — delete global category
router.delete("/global/:id", authenticate, isSuperAdmin, async (req: Req, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    ok(res, null, "Category deleted");
  } catch (e: any) { fail(res, e.message); }
});

export default router;
