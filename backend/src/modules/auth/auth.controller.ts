import { Request, Response } from "express";
import { authService } from "./auth.service";
import { registerSchema, loginSchema, changePasswordSchema } from "./auth.schema";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth.middleware";
import { upload, getFileUrl } from "../../middleware/upload.middleware";

export const authController = {
  async register(req: Request, res: Response): Promise<void> {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, "Validation error", 422, parsed.error.errors); return; }
    try {
      const result = await authService.register(parsed.data);
      sendSuccess(res, result, "Account created successfully", 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, "Validation error", 422, parsed.error.errors); return; }
    try {
      const result = await authService.login(parsed.data);
      sendSuccess(res, result, "Login successful");
    } catch (err: any) {
      sendError(res, err.message, 401);
    }
  },

  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.getProfile(req.user!.userId);
      sendSuccess(res, user);
    } catch (err: any) {
      sendError(res, err.message, 404);
    }
  },

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await authService.updateProfile(req.user!.userId, req.body);
      sendSuccess(res, user, "Profile updated");
    } catch (err: any) {
      sendError(res, err.message);
    }
  },

  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) { sendError(res, "Validation error", 422, parsed.error.errors); return; }
    try {
      await authService.changePassword(req.user!.userId, parsed.data);
      sendSuccess(res, null, "Password changed successfully");
    } catch (err: any) {
      sendError(res, err.message);
    }
  },

  uploadAvatar: [
    upload.single("avatar"),
    async (req: AuthRequest, res: Response): Promise<void> => {
      if (!req.file) { sendError(res, "No file uploaded"); return; }
      try {
        const url = getFileUrl(req, req.file.filename);
        const user = await authService.updateProfile(req.user!.userId, { avatarUrl: url });
        sendSuccess(res, { url, user }, "Avatar uploaded");
      } catch (err: any) {
        sendError(res, err.message);
      }
    },
  ],
};
