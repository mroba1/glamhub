import { Router, Response } from "express";
import { prisma } from "../../config/db";
import { ok, fail, generateBookingNumber } from "../../utils";
import { authenticate, isAdmin, isCustomer, Req } from "../../middleware/auth";
import { upload, fileUrl } from "../../middleware/upload";

const router = Router();

// Customer — create booking
router.post("/", authenticate, isCustomer, async (req: Req, res: Response) => {
  try {
    const { serviceId, companyId, date, timeSlot, notes } = req.body;
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.isActive) return fail(res, "Service not available");
    const booking = await prisma.booking.create({
      data: { bookingNumber: generateBookingNumber(), customerId: req.user!.userId, serviceId, companyId, date, timeSlot, notes },
      include: { service: true, customer: { select: { id: true, name: true, email: true, phone: true } } },
    });
    ok(res, booking, "Booking created. Upload payment proof.", 201);
  } catch (e: any) { fail(res, e.message); }
});

// Customer — get my bookings
router.get("/my", authenticate, isCustomer, async (req: Req, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query as any;
    const where: any = { customerId: req.user!.userId };
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      prisma.booking.findMany({ where, skip: (+page - 1) * +limit, take: +limit, include: { service: true, company: { select: { name: true, slug: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.booking.count({ where }),
    ]);
    ok(res, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
  } catch (e: any) { fail(res, e.message); }
});

// Customer — upload payment proof
router.post("/:id/payment", authenticate, isCustomer, upload.single("proof"), async (req: Req, res: Response) => {
  if (!req.file) return fail(res, "No file uploaded");
  try {
    const url = fileUrl(req, req.file.filename);
    const booking = await prisma.booking.update({ where: { id: req.params.id }, data: { paymentProofUrl: url } });
    ok(res, booking, "Payment proof uploaded");
  } catch (e: any) { fail(res, e.message); }
});

// Admin — get company bookings
router.get("/company", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query as any;
    const where: any = { companyId: req.user!.companyId! };
    if (status) where.status = status;
    if (search) where.customer = { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] };
    const [data, total] = await Promise.all([
      prisma.booking.findMany({ where, skip: (+page - 1) * +limit, take: +limit, include: { service: true, customer: { select: { id: true, name: true, email: true, phone: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.booking.count({ where }),
    ]);
    ok(res, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
  } catch (e: any) { fail(res, e.message); }
});

// Admin — update booking status
router.patch("/:id/status", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const { status, adminNote } = req.body;
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status, ...(adminNote && { adminNote }) },
      include: { customer: { select: { id: true, name: true } }, service: true },
    });
    // Notify customer
    await prisma.notification.create({
      data: {
        userId: booking.customer.id,
        type: `booking_${status.toLowerCase()}`,
        title: status === "APPROVED" ? "Booking Approved!" : `Booking ${status}`,
        message: status === "APPROVED"
          ? `Your ${booking.service.name} on ${booking.date} at ${booking.timeSlot} is confirmed.`
          : `Your booking for ${booking.service.name} has been ${status.toLowerCase()}.`,
        metadata: { bookingId: booking.id, bookingNumber: booking.bookingNumber },
      },
    });
    ok(res, booking, "Booking updated");
  } catch (e: any) { fail(res, e.message); }
});

export default router;
