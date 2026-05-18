import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/constants";

// ===== AUTH =====
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(60),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().regex(/^(0|\+234)[789]\d{9}$/, "Enter a valid Nigerian phone number").optional().or(z.literal("")),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(60),
  phone: z.string().regex(/^(0|\+234)[789]\d{9}$/, "Enter a valid Nigerian phone number").optional().or(z.literal("")),
  address: z.string().max(200).optional(),
});

// ===== BOOKING =====
export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select a date"),
  timeSlot: z.string().min(1, "Please select a time slot"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

// ===== PRODUCT =====
export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").max(120),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000),
  price: z.coerce.number().positive("Price must be a positive number"),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Please select a category"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().min(2, "SKU is required").max(50),
  tags: z.string().optional(),
});

// ===== CATEGORY =====
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(50)
    .refine((val) => /^[a-zA-Z\s&-]+$/.test(val), "Category name can only contain letters, spaces, & and -"),
  description: z.string().max(200, "Description cannot exceed 200 characters").optional(),
});

// ===== ORDER =====
export const createOrderSchema = z.object({
  shippingAddress: z.string().min(10, "Please enter your full address").max(300),
  notes: z.string().max(500).optional(),
});

// ===== UPLOAD =====
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPEG, PNG, and WebP images are accepted"
    ),
});

// ===== COMPANY =====
export const companySettingsSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  address: z.string().min(5, "Enter a valid address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type CreateBookingFormData = z.infer<typeof createBookingSchema>;
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type CreateOrderFormData = z.infer<typeof createOrderSchema>;
export type CompanySettingsFormData = z.infer<typeof companySettingsSchema>;
