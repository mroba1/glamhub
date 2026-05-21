import { Router, Response } from "express";
import { prisma } from "../../config/db";
import { ok, fail, slugify } from "../../utils";
import { authenticate, isAdmin, isSuperAdmin, Req } from "../../middleware/auth";
import { upload, fileUrl } from "../../middleware/upload";

const router = Router();

// Public — get company by slug (for mini-site)
router.get("/public/:slug", async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { slug: req.params.slug },
      include: {
        branding: true,
        services: { where: { isActive: true }, include: { category: true } },
      },
    });
    if (!company) return fail(res, "Company not found", 404);
    ok(res, company);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — get own company stats
// Admin — get own customers
router.get("/me/customers", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const { search, page = 1, limit = 20 } = req.query as any;
    const where: any = { companyId: req.user!.companyId!, role: "CUSTOMER" };
    if (search) where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where, skip: (+page - 1) * +limit, take: +limit,
        select: { id: true, name: true, email: true, phone: true, avatarUrl: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);
    ok(res, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
  } catch (e: any) { fail(res, e.message); }
});

router.get("/me/stats", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const cid = req.user!.companyId!;
    const [bookings, products, customers, orders] = await Promise.all([
      prisma.booking.count({ where: { companyId: cid } }),
      prisma.product.count({ where: { companyId: cid } }),
      prisma.user.count({ where: { companyId: cid, role: "CUSTOMER" } }),
      prisma.order.count({ where: { companyId: cid } }),
    ]);
    ok(res, { bookings, products, customers, orders });
  } catch (e: any) { fail(res, e.message); }
});

// Admin — get own branding
router.get("/me/branding", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const b = await prisma.companyBranding.findUnique({ where: { companyId: req.user!.companyId! } });
    ok(res, b);
  } catch (e: any) { fail(res, e.message); }
});

// Admin — update branding
router.patch("/me/branding", authenticate, isAdmin, async (req: Req, res: Response) => {
  try {
    const b = await prisma.companyBranding.upsert({
      where: { companyId: req.user!.companyId! },
      create: { companyId: req.user!.companyId!, ...req.body },
      update: req.body,
    });
    ok(res, b, "Branding updated");
  } catch (e: any) { fail(res, e.message); }
});

// Admin — upload logo
router.post("/me/logo", authenticate, isAdmin, upload.single("logo"), async (req: Req, res: Response) => {
  if (!req.file) return fail(res, "No file");
  try {
    const url = fileUrl(req, req.file.filename);
    await prisma.companyBranding.upsert({
      where: { companyId: req.user!.companyId! },
      create: { companyId: req.user!.companyId!, logoUrl: url },
      update: { logoUrl: url },
    });
    ok(res, { url }, "Logo uploaded");
  } catch (e: any) { fail(res, e.message); }
});

// Admin — upload banner
router.post("/me/banner", authenticate, isAdmin, upload.single("banner"), async (req: Req, res: Response) => {
  if (!req.file) return fail(res, "No file");
  try {
    const url = fileUrl(req, req.file.filename);
    await prisma.companyBranding.upsert({
      where: { companyId: req.user!.companyId! },
      create: { companyId: req.user!.companyId!, bannerUrl: url },
      update: { bannerUrl: url },
    });
    ok(res, { url }, "Banner uploaded");
  } catch (e: any) { fail(res, e.message); }
});

// Admin — upload gallery image
router.post("/me/gallery", authenticate, isAdmin, upload.single("image"), async (req: Req, res: Response) => {
  if (!req.file) return fail(res, "No file");
  try {
    const url = fileUrl(req, req.file.filename);
    const existing = await prisma.companyBranding.findUnique({ where: { companyId: req.user!.companyId! } });
    const gallery = [...(existing?.gallery || []), url];
    await prisma.companyBranding.upsert({
      where: { companyId: req.user!.companyId! },
      create: { companyId: req.user!.companyId!, gallery },
      update: { gallery },
    });
    ok(res, { url }, "Gallery image added");
  } catch (e: any) { fail(res, e.message); }
});

// Super Admin — get all companies
router.get("/", authenticate, isSuperAdmin, async (req: Req, res: Response) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query as any;
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search, mode: "insensitive" } }, { city: { contains: search, mode: "insensitive" } }];
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      prisma.company.findMany({ where, skip: (+page - 1) * +limit, take: +limit, include: { branding: true, subscription: { include: { plan: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.company.count({ where }),
    ]);
    ok(res, { data, total, page: +page, limit: +limit, totalPages: Math.ceil(total / +limit) });
  } catch (e: any) { fail(res, e.message); }
});

// Super Admin — update company status
router.patch("/:id/status", authenticate, isSuperAdmin, async (req: Req, res: Response) => {
  try {
    const company = await prisma.company.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    ok(res, company, `Company ${req.body.status.toLowerCase()}`);
  } catch (e: any) { fail(res, e.message); }
});

export default router;
