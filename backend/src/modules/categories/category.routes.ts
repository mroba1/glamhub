import { Router } from "express";
import { Response } from "express";
import { prisma } from "../../config/database";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin, requireSuperAdmin } from "../../middleware/role.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth.middleware";
import { normalizeCategory, slugify } from "../../utils/response";

const router = Router();

// Public — get all global categories
router.get("/global", async (_req, res) => {
  try {
    const cats = await prisma.category.findMany({ where: { isGlobal: true, isActive: true }, orderBy: { name: "asc" } });
    sendSuccess(res, cats);
  } catch (err: any) { sendError(res, err.message); }
});

// Admin — get own company categories + global
router.get("/", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const cats = await prisma.category.findMany({
      where: { OR: [{ isGlobal: true }, { companyId: req.user!.companyId! }], isActive: true },
      orderBy: { name: "asc" },
    });
    sendSuccess(res, cats);
  } catch (err: any) { sendError(res, err.message); }
});

router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const normalized = normalizeCategory(req.body.name);
    const exists = await prisma.category.findFirst({
      where: { slug: slugify(normalized), companyId: req.user!.companyId! },
    });
    if (exists) { sendError(res, "Category already exists"); return; }
    const cat = await prisma.category.create({
      data: { name: req.body.name, slug: slugify(normalized), companyId: req.user!.companyId! },
    });
    sendSuccess(res, cat, "Category created", 201);
  } catch (err: any) { sendError(res, err.message); }
});

router.patch("/:id", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!existing || (existing.companyId !== req.user!.companyId! && !existing.isGlobal)) { sendError(res, "Not found", 404); return; }
    const cat = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
    sendSuccess(res, cat, "Category updated");
  } catch (err: any) { sendError(res, err.message); }
});

router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.companyId !== req.user!.companyId!) { sendError(res, "Not found", 404); return; }
    await prisma.category.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, "Category deleted");
  } catch (err: any) { sendError(res, err.message); }
});

// Super admin — global categories
router.post("/global", authenticate, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const normalized = normalizeCategory(req.body.name);
    const exists = await prisma.category.findFirst({ where: { slug: slugify(normalized), isGlobal: true } });
    if (exists) { sendError(res, "Global category already exists"); return; }
    const cat = await prisma.category.create({
      data: { name: req.body.name, slug: slugify(normalized), isGlobal: true },
    });
    sendSuccess(res, cat, "Global category created", 201);
  } catch (err: any) { sendError(res, err.message); }
});

router.delete("/global/:id", authenticate, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, "Global category deleted");
  } catch (err: any) { sendError(res, err.message); }
});

export default router;
