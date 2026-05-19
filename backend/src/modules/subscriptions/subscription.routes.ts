import { Router } from "express";
import { Response } from "express";
import { prisma } from "../../config/database";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin, requireSuperAdmin } from "../../middleware/role.middleware";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth.middleware";
import { upload, getFileUrl } from "../../middleware/upload.middleware";

const router = Router();

// Public — get plans
router.get("/plans", async (_req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({ where: { isActive: true } });
    sendSuccess(res, plans);
  } catch (err: any) { sendError(res, err.message); }
});

// Admin — get own subscription
router.get("/my", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const sub = await prisma.subscription.findUnique({
      where: { companyId: req.user!.companyId! },
      include: { plan: true },
    });
    sendSuccess(res, sub);
  } catch (err: any) { sendError(res, err.message); }
});

// Admin — subscribe to a plan
router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { planId, interval } = req.body;
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) { sendError(res, "Plan not found", 404); return; }
    const amount = interval === "YEARLY" ? plan.yearlyPrice : plan.monthlyPrice;
    const sub = await prisma.subscription.upsert({
      where:  { companyId: req.user!.companyId! },
      create: { companyId: req.user!.companyId!, planId, interval, amount, status: "PENDING_PAYMENT" },
      update: { planId, interval, amount, status: "PENDING_PAYMENT" },
      include: { plan: true },
    });
    sendSuccess(res, sub, "Subscription initiated. Upload payment proof.", 201);
  } catch (err: any) { sendError(res, err.message); }
});

// Admin — upload payment proof
router.post("/payment-proof", authenticate, requireAdmin, upload.single("proof"), async (req: AuthRequest, res: Response) => {
  if (!req.file) { sendError(res, "No file uploaded"); return; }
  try {
    const url = getFileUrl(req, req.file.filename);
    const { paymentReference } = req.body;
    const sub = await prisma.subscription.update({
      where: { companyId: req.user!.companyId! },
      data:  { paymentProofUrl: url, paymentReference, status: "PENDING_PAYMENT" },
    });
    // Create payment record for super admin review
    const existing = await prisma.subscription.findUnique({ where: { companyId: req.user!.companyId! }, include: { plan: true } });
    await prisma.payment.create({
      data: {
        companyId:    req.user!.companyId!,
        planName:     existing?.plan?.name ?? "",
        interval:     existing?.interval ?? "MONTHLY",
        amount:       existing?.amount ?? 0,
        screenshotUrl: url,
        reference:    paymentReference,
        status:       "PENDING",
      },
    });
    sendSuccess(res, sub, "Payment proof uploaded. Awaiting Glam Hub review.");
  } catch (err: any) { sendError(res, err.message); }
});

// Super admin — view all subscriptions
router.get("/all", authenticate, requireSuperAdmin, async (_req, res) => {
  try {
    const subs = await prisma.subscription.findMany({ include: { plan: true, company: { select: { name: true, slug: true } } }, orderBy: { createdAt: "desc" } });
    sendSuccess(res, subs);
  } catch (err: any) { sendError(res, err.message); }
});

// Super admin — get all payment submissions
router.get("/payments", authenticate, requireSuperAdmin, async (_req, res) => {
  try {
    const payments = await prisma.payment.findMany({ include: { company: { select: { name: true, slug: true } } }, orderBy: { createdAt: "desc" } });
    sendSuccess(res, payments);
  } catch (err: any) { sendError(res, err.message); }
});

// Super admin — approve / reject payment
router.patch("/payments/:id", authenticate, requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { action, note } = req.body; // action: "approve" | "reject"
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data:  { status: action === "approve" ? "APPROVED" : "REJECTED", reviewNote: note, reviewedBy: req.user!.userId, reviewedAt: new Date() },
      include: { company: true },
    });

    if (action === "approve") {
      const now   = new Date();
      const end   = new Date(now);
      const sub   = await prisma.subscription.findUnique({ where: { companyId: payment.companyId } });
      if (sub?.interval === "YEARLY") end.setFullYear(end.getFullYear() + 1);
      else end.setMonth(end.getMonth() + 1);

      await Promise.all([
        prisma.subscription.update({
          where: { companyId: payment.companyId },
          data:  { status: "ACTIVE", startDate: now, endDate: end, approvedBy: req.user!.userId, approvedAt: now },
        }),
        prisma.company.update({ where: { id: payment.companyId }, data: { status: "ACTIVE" } }),
        prisma.notification.create({
          data: {
            userId:  payment.company.adminId,
            type:    "subscription_approved",
            title:   "Subscription Approved!",
            message: `Your ${payment.planName} subscription has been approved. Your dashboard is now active.`,
          },
        }),
      ]);
    } else {
      await prisma.notification.create({
        data: {
          userId:  payment.company.adminId,
          type:    "subscription_rejected",
          title:   "Payment Not Confirmed",
          message: note ?? "Your payment could not be verified. Please re-upload your proof.",
        },
      });
    }
    sendSuccess(res, payment, `Payment ${action === "approve" ? "approved" : "rejected"}`);
  } catch (err: any) { sendError(res, err.message); }
});

export default router;
