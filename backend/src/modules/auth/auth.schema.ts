import { z } from "zod";

export const registerSchema = z.object({
  name:         z.string().min(2),
  email:        z.string().email(),
  phone:        z.string().optional(),
  password:     z.string().min(8),
  role:         z.enum(["CUSTOMER", "ADMIN"]).default("ADMIN"),
  companyId:    z.string().optional(), // for customers registering to a company
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  city:         z.string().optional(),
  state:        z.string().optional(),
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8),
});

export type RegisterInput      = z.infer<typeof registerSchema>;
export type LoginInput         = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
