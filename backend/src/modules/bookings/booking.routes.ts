import { Router } from "express";
import { Response } from "express";
import { bookingService } from "./booking.service";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin, requireCustomer } from "../../middleware/role.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth.middleware";
import { upload, getFileUrl } from "../../middleware/upload.middleware";

const router = Router();

// Customer
router.post("/", authenticate, requireCustomer, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.create({ ...req.body, customerId: req.user!.userId });
    sendSuccess(res, booking, "Booking created", 201);
  } catch (err: any) { sendError(res, err.message); }
});

router.get("/my", authenticate, requireCustomer, async (req: AuthRequest, res: Response) => {
  try {
    const result = await bookingService.getMyBookings(req.user!.userId, req.query as any);
    sendSuccess(res, result);
  } catch (err: any) { sendError(res, err.message); }
});

router.post("/:id/payment", authenticate, requireCustomer,
  upload.single("proof"),
  async (req: AuthRequest, res: Response) => {
    if (!req.file) { sendError(res, "No file uploaded"); return; }
    try {
      const url     = getFileUrl(req, req.file.filename);
      const booking = await bookingService.uploadPaymentProof(req.params.id, url, req.user!.userId);
      sendSuccess(res, booking, "Payment proof uploaded");
    } catch (err: any) { sendError(res, err.message); }
  }
);

// Admin
router.get("/company", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await bookingService.getCompanyBookings(req.user!.companyId!, req.query as any);
    sendSuccess(res, result);
  } catch (err: any) { sendError(res, err.message); }
});

router.patch("/:id/status", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const booking = await bookingService.updateStatus(req.params.id, req.body.status, req.body.adminNote, req.user!.companyId!);
    sendSuccess(res, booking, "Booking status updated");
  } catch (err: any) { sendError(res, err.message); }
});

export default router;
