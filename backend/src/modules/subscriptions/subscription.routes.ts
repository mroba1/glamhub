import { Router, Response } from "express";
import { prisma } from "../../config/db";
import { ok, fail } from "../../utils";
import { authenticate, isAdmin, isSuperAdmin, Req } from "../../middleware/auth";
import { upload, fileUrl } from "../../middleware/upload";

const router = Router();

// Public — get plans
router.get("/plans", async (_req, res) => {
  try {
    const plans = await prisma.subscriptionPlan.findMany({ where: { isActive: true } });
    ok(res, plans);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — get my subscription
router.get("/my", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const sub = await prisma.subscription.findUnique({
      where: { companyId: req.user!.companyId! },
      include: { plan: true },
    });
    ok(res, sub);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — subscribe to plan
router.post("/", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const { planId, interval } = req.body;
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) return fail(res, "Plan not found", 404);
    const amount = interval === "YEARLY" ? plan.yearlyPrice : plan.monthlyPrice;
    const sub = await prisma.subscription.upsert({
      where: { companyId: req.user!.companyId! },
      create: { companyId: req.user!.companyId!, planId, interval, amount, status: "PENDING_PAYMENT" },
      update: { planId, interval, amount, status: "PENDING_PAYMENT" },
      include: { plan: true },
    });
    ok(res, sub, "Subscription initiated. Upload payment proof.", 201);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — upload payment proof
router.post("/payment-proof", authenticate, isAdmin, upload.single("proof"), async (req: Req, res: Response) => {
  if (!req.file) return fail(res, "No file uploaded");
  try {
    const url = fileUrl(req, req.file.filename);
    const { paymentReference } = req.body;
    const sub = await prisma.subscription.findUnique({ where: { companyId: req.user!.companyId! }, include: { plan: true } });
    if (!sub) return fail(res, "No active subscription found");
    await Promise.all([
      prisma.subscription.update({ where: { companyId: req.user!.companyId! }, data: { paymentProofUrl: url, paymentReference } }),
      prisma.payment.create({
        data: {
          companyId: req.user!.companyId!, planName: sub.plan.name,
          interval: sub.interval, amount: sub.amount, screenshotUrl: url, reference: paymentReference, status: "PENDING",
        },
      }),
    ]);
    ok(res, null, "Payment proof uploaded. Awaiting Glam Hub review.");
  } catch (e: any) { fail(res, e.message); }
});

// Super Admin — all subscriptions
router.get("/all", authenticate, isSuperAdmin, async (_req, res) => {
  try {
    const subs = await prisma.subscription.findMany({ include: { plan: true, company: { select: { name: true, slug: true } } }, orderBy: { createdAt: "desc" } });
    ok(res, subs);
  } catch (e: any) { fail(res, e.message); }
});

// Super Admin — all payment submissions
router.get("/payments", authenticate, isSuperAdmin, async (_req, res) => {
  try {
    const payments = await prisma.payment.findMany({ include: { company: { select: { name: true, slug: true, adminId: true } } }, orderBy: { createdAt: "desc" } });
    ok(res, payments);
  } catch (e: any) { fail(res, e.message); }
});

// Super Admin — approve / reject payment
router.patch("/payments/:id", authenticate, isSuperAdmin, async (req: Req, res: Response) => {
  try {
    const { action, note } = req.body;
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: { status: action === "approve" ? "APPROVED" : "REJECTED", reviewNote: note, reviewedBy: req.user!.userId, reviewedAt: new Date() },
      include: { company: true },
    });
    if (action === "approve") {
      const now = new Date();
      const end = new Date(now);
      const sub = await prisma.subscription.findUnique({ where: { companyId: payment.companyId } });
      if (sub?.interval === "YEARLY") end.setFullYear(end.getFullYear() + 1);
      else end.setMonth(end.getMonth() + 1);
      await Promise.all([
        prisma.subscription.update({ where: { companyId: payment.companyId }, data: { status: "ACTIVE", startDate: now, endDate: end, approvedBy: req.user!.userId, approvedAt: now } }),
        prisma.company.update({ where: { id: payment.companyId }, data: { status: "ACTIVE" } }),
        prisma.notification.create({ data: { userId: payment.company.adminId, type: "subscription_approved", title: "Subscription Approved!", message: `Your ${payment.planName} subscription is now active. Start customizing your site!` } }),
      ]);
    } else {
      await prisma.notification.create({ data: { userId: payment.company.adminId, type: "subscription_rejected", title: "Payment Not Confirmed", message: note || "Your payment could not be verified. Please re-upload your proof." } });
    }
    ok(res, payment, `Payment ${action === "approve" ? "approved" : "rejected"}`);
  } catch (e: any) { fail(res, e.message); }
});

export default router;
