import { Router, Response } from "express";
import { prisma } from "../../config/db";
import { ok, fail } from "../../utils";
import { authenticate, isAdmin, Req } from "../../middleware/auth";
import { upload, fileUrl } from "../../middleware/upload";

const router = Router();

// Public — services for a company
router.get("/public/:companyId", async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { companyId: req.params.companyId, isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    ok(res, services);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — get own services
router.get("/", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: { companyId: req.user!.companyId! },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    ok(res, services);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — create service
router.post("/", authenticate, isAdmin, upload.single("image"), async (req: Req, res: Response) => {
  try {
    const imageUrl = req.file ? fileUrl(req, req.file.filename) : undefined;
    const { name, description, price, duration, categoryId } = req.body;
    const service = await prisma.service.create({
      data: { name, description, price: +price, duration: +duration, categoryId, companyId: req.user!.companyId!, imageUrl },
      include: { category: true },
    });
    ok(res, service, "Service created", 201);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — update service
router.patch("/:id", authenticate, isAdmin, upload.single("image"), async (req: Req, res: Response) => {
  try {
    const existing = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.companyId !== req.user!.companyId!) return fail(res, "Not found", 404);
    const imageUrl = req.file ? fileUrl(req, req.file.filename) : undefined;
    const { price, duration, ...rest } = req.body;
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: { ...rest, ...(price && { price: +price }), ...(duration && { duration: +duration }), ...(imageUrl && { imageUrl }) },
      include: { category: true },
    });
    ok(res, service, "Service updated");
  } catch (e: any) { fail(res, e.message); }
});

// Admin — delete service
router.delete("/:id", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const existing = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.companyId !== req.user!.companyId!) return fail(res, "Not found", 404);
    await prisma.service.delete({ where: { id: req.params.id } });
    ok(res, null, "Service deleted");
  } catch (e: any) { fail(res, e.message); }
});

export default router;
