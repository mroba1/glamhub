import { Router } from "express";
import { prisma } from "../../config/db";
import { hashPassword, comparePassword, signToken, signRefresh, ok, fail, slugify } from "../../utils";
import { authenticate, Req } from "../../middleware/auth";
import { upload, fileUrl } from "../../middleware/upload";
import { z } from "zod";
import { Response } from "express";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  role: z.enum(["CUSTOMER", "ADMIN"]).default("ADMIN"),
  companyId: z.string().optional(),
  businessName: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Register
router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Validation error", 422, parsed.error.errors);
  const d = parsed.data;
  try {
    const exists = await prisma.user.findUnique({ where: { email: d.email } });
    if (exists) return fail(res, "Email already in use");

    const hashed = await hashPassword(d.password);

    if (d.role === "ADMIN") {
      const companyName = d.businessName || `${d.name}'s Salon`;
      let slug = slugify(companyName);
      let i = 1;
      while (await prisma.company.findUnique({ where: { slug } })) slug = `${slugify(companyName)}-${i++}`;

      const user = await prisma.user.create({
        data: {
          name: d.name, email: d.email, phone: d.phone, password: hashed, role: "ADMIN",
          managedCompany: {
            create: {
              name: companyName, slug, email: d.email, phone: d.phone,
              city: d.city, state: d.state, status: "PENDING",
              branding: { create: { businessName: companyName } },
            },
          },
        },
        include: { managedCompany: true },
      });

      const payload = { userId: user.id, role: user.role, companyId: user.managedCompany?.id };
      const { password: _, ...safe } = user;
      return ok(res, { user: safe, accessToken: signToken(payload), refreshToken: signRefresh(payload) }, "Account created", 201);
    }

    const user = await prisma.user.create({
      data: { name: d.name, email: d.email, phone: d.phone, password: hashed, role: "CUSTOMER", companyId: d.companyId },
    });
    const payload = { userId: user.id, role: user.role, companyId: user.companyId };
    const { password: _, ...safe } = user;
    return ok(res, { user: safe, accessToken: signToken(payload), refreshToken: signRefresh(payload) }, "Account created", 201);
  } catch (e: any) { fail(res, e.message); }
});

// Login
router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return fail(res, "Validation error", 422, parsed.error.errors);
  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      include: { managedCompany: true },
    });
    if (!user) return fail(res, "Invalid email or password", 401);
    if (!user.isActive) return fail(res, "Account suspended. Contact Glam Hub.", 401);
    if (!await comparePassword(parsed.data.password, user.password)) return fail(res, "Invalid email or password", 401);

    const companyId = user.managedCompany?.id || user.companyId;
    const payload = { userId: user.id, role: user.role, companyId };
    const { password: _, ...safe } = user;
    return ok(res, { user: safe, accessToken: signToken(payload), refreshToken: signRefresh(payload) }, "Login successful");
  } catch (e: any) { fail(res, e.message); }
});

// Get profile
router.get("/profile", authenticate, async (req: Req, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { managedCompany: { include: { branding: true, subscription: true } } },
    });
    if (!user) return fail(res, "User not found", 404);
    const { password: _, ...safe } = user;
    ok(res, safe);
  } catch (e: any) { fail(res, e.message); }
});

// Update profile
router.patch("/profile", authenticate, async (req: Req, res: Response) => {
  try {
    const user = await prisma.user.update({ where: { id: req.user!.userId }, data: req.body });
    const { password: _, ...safe } = user;
    ok(res, safe, "Profile updated");
  } catch (e: any) { fail(res, e.message); }
});

// Change password
router.patch("/change-password", authenticate, async (req: Req, res: Response) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.userId } });
    if (!await comparePassword(req.body.currentPassword, user.password)) return fail(res, "Current password incorrect");
    await prisma.user.update({ where: { id: req.user!.userId }, data: { password: await hashPassword(req.body.newPassword) } });
    ok(res, null, "Password changed");
  } catch (e: any) { fail(res, e.message); }
});

// Upload avatar
router.post("/avatar", authenticate, upload.single("avatar"), async (req: Req, res: Response) => {
  if (!req.file) return fail(res, "No file uploaded");
  try {
    const url = fileUrl(req, req.file.filename);
    await prisma.user.update({ where: { id: req.user!.userId }, data: { avatarUrl: url } });
    ok(res, { url }, "Avatar uploaded");
  } catch (e: any) { fail(res, e.message); }
});

export default router;
