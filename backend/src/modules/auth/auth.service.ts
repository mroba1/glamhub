import { prisma } from "../../config/database";
import { hashPassword, comparePassword } from "../../utils/hash";
import { signToken, signRefreshToken, JwtPayload } from "../../utils/jwt";
import { slugify } from "../../utils/response";
import { RegisterInput, LoginInput, ChangePasswordInput } from "./auth.schema";

export const authService = {
  async register(input: RegisterInput) {
    // Check email not already taken
    const exists = await prisma.user.findUnique({ where: { email: input.email } });
    if (exists) throw new Error("Email already in use");

    const hashed = await hashPassword(input.password);

    // If registering as ADMIN — create a pending company too
    if (input.role === "ADMIN") {
      const companyName = input.businessName || input.name + "'s Salon";
      const slug = await uniqueSlug(companyName);

      const user = await prisma.user.create({
        data: {
          name:     input.name,
          email:    input.email,
          phone:    input.phone,
          password: hashed,
          role:     "ADMIN",
          managedCompany: {
            create: {
              name:   companyName,
              slug,
              email:  input.email,
              phone:  input.phone,
              city:   input.city,
              state:  input.state,
              status: "PENDING",
              branding: { create: { businessName: companyName } },
            },
          },
        },
        include: { managedCompany: true },
      });

      const payload: JwtPayload = {
        userId:    user.id,
        role:      user.role,
        companyId: user.managedCompany?.id,
      };

      return {
        user:         sanitize(user),
        company:      user.managedCompany,
        accessToken:  signToken(payload),
        refreshToken: signRefreshToken(payload),
      };
    }

    // Customer registration — scoped to a company
    const user = await prisma.user.create({
      data: {
        name:      input.name,
        email:     input.email,
        phone:     input.phone,
        password:  hashed,
        role:      "CUSTOMER",
        companyId: input.companyId,
      },
    });

    const payload: JwtPayload = {
      userId:    user.id,
      role:      user.role,
      companyId: user.companyId,
    };

    return {
      user:         sanitize(user),
      accessToken:  signToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where:   { email: input.email },
      include: { managedCompany: true },
    });
    if (!user) throw new Error("Invalid email or password");
    if (!user.isActive) throw new Error("Account is suspended. Contact Glam Hub support.");

    const match = await comparePassword(input.password, user.password);
    if (!match) throw new Error("Invalid email or password");

    const companyId = user.managedCompany?.id ?? user.companyId;
    const payload: JwtPayload = { userId: user.id, role: user.role, companyId };

    return {
      user:         sanitize(user),
      company:      user.managedCompany ?? null,
      accessToken:  signToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  },

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where:   { id: userId },
      include: { managedCompany: { include: { branding: true, subscription: true } } },
    });
    if (!user) throw new Error("User not found");
    return sanitize(user);
  },

  async updateProfile(userId: string, data: Partial<{ name: string; phone: string; avatarUrl: string }>) {
    const user = await prisma.user.update({ where: { id: userId }, data });
    return sanitize(user);
  },

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const match = await comparePassword(input.currentPassword, user.password);
    if (!match) throw new Error("Current password is incorrect");
    const hashed = await hashPassword(input.newPassword);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
  },
};

// ── Helpers ─────────────────────────────────────────────
const sanitize = (user: any) => {
  const { password, ...rest } = user;
  return rest;
};

const uniqueSlug = async (name: string): Promise<string> => {
  let base = slugify(name);
  let slug = base;
  let i = 1;
  while (await prisma.company.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
};
