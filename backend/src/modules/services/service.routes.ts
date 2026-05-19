import { Router } from "express";
import { Response } from "express";
import { prisma } from "../../config/database";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin } from "../../middleware/role.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth.middleware";
import { upload, getFileUrl } from "../../middleware/upload.middleware";

const router = Router();

// Public — get services for a company
router.get("/company/:companyId", async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { companyId: req.params.companyId, isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    sendSuccess(res, services);
  } catch (err: any) { sendError(res, err.message); }
});

// Admin — manage own services
router.get("/", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: { companyId: req.user!.companyId! },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    sendSuccess(res, services);
  } catch (err: any) { sendError(res, err.message); }
});

router.post("/", authenticate, requireAdmin, upload.single("image"), async (req: AuthRequest, res: Response) => {
  try {
    const imageUrl = req.file ? getFileUrl(req, req.file.filename) : undefined;
    const service  = await prisma.service.create({
      data: { ...req.body, price: +req.body.price, duration: +req.body.duration, companyId: req.user!.companyId!, imageUrl },
      include: { category: true },
    });
    sendSuccess(res, service, "Service created", 201);
  } catch (err: any) { sendError(res, err.message); }
});

router.patch("/:id", authenticate, requireAdmin, upload.single("image"), async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.companyId !== req.user!.companyId!) { sendError(res, "Not found", 404); return; }
    const imageUrl = req.file ? getFileUrl(req, req.file.filename) : undefined;
    const service  = await prisma.service.update({
      where: { id: req.params.id },
      data:  { ...req.body, ...(req.body.price && { price: +req.body.price }), ...(req.body.duration && { duration: +req.body.duration }), ...(imageUrl && { imageUrl }) },
      include: { category: true },
    });
    sendSuccess(res, service, "Service updated");
  } catch (err: any) { sendError(res, err.message); }
});

router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!existing || existing.companyId !== req.user!.companyId!) { sendError(res, "Not found", 404); return; }
    await prisma.service.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, "Service deleted");
  } catch (err: any) { sendError(res, err.message); }
});

export default router;
