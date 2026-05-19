import { Response } from "express";
import { companyService } from "./company.service";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthRequest } from "../../middleware/auth.middleware";
import { upload, getFileUrl } from "../../middleware/upload.middleware";

export const companyController = {
  async getAll(req: AuthRequest, res: Response): Promise<void> {
    try {
      const result = await companyService.getAll(req.query as any);
      sendSuccess(res, result);
    } catch (err: any) { sendError(res, err.message); }
  },

  async getBySlug(req: AuthRequest, res: Response): Promise<void> {
    try {
      const company = await companyService.getBySlug(req.params.slug);
      if (!company) { sendError(res, "Company not found", 404); return; }
      sendSuccess(res, company);
    } catch (err: any) { sendError(res, err.message); }
  },

  async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const company = await companyService.updateStatus(req.params.id, req.body.status, req.user!.userId);
      sendSuccess(res, company, `Company ${req.body.status.toLowerCase()}`);
    } catch (err: any) { sendError(res, err.message); }
  },

  async getBranding(req: AuthRequest, res: Response): Promise<void> {
    try {
      const companyId = req.user!.companyId!;
      const branding  = await companyService.getBranding(companyId);
      sendSuccess(res, branding);
    } catch (err: any) { sendError(res, err.message); }
  },

  async updateBranding(req: AuthRequest, res: Response): Promise<void> {
    try {
      const companyId = req.user!.companyId!;
      const branding  = await companyService.updateBranding(companyId, req.body);
      sendSuccess(res, branding, "Branding updated");
    } catch (err: any) { sendError(res, err.message); }
  },

  uploadLogo: [
    upload.single("logo"),
    async (req: AuthRequest, res: Response): Promise<void> => {
      if (!req.file) { sendError(res, "No file uploaded"); return; }
      try {
        const url      = getFileUrl(req, req.file.filename);
        const branding = await companyService.uploadLogo(req.user!.companyId!, url);
        sendSuccess(res, { url, branding }, "Logo uploaded");
      } catch (err: any) { sendError(res, err.message); }
    },
  ],

  uploadBanner: [
    upload.single("banner"),
    async (req: AuthRequest, res: Response): Promise<void> => {
      if (!req.file) { sendError(res, "No file uploaded"); return; }
      try {
        const url      = getFileUrl(req, req.file.filename);
        const branding = await companyService.uploadBanner(req.user!.companyId!, url);
        sendSuccess(res, { url, branding }, "Banner uploaded");
      } catch (err: any) { sendError(res, err.message); }
    },
  ],

  uploadGallery: [
    upload.single("image"),
    async (req: AuthRequest, res: Response): Promise<void> => {
      if (!req.file) { sendError(res, "No file uploaded"); return; }
      try {
        const url      = getFileUrl(req, req.file.filename);
        const branding = await companyService.addGalleryImage(req.user!.companyId!, url);
        sendSuccess(res, { url, branding }, "Gallery image added");
      } catch (err: any) { sendError(res, err.message); }
    },
  ],

  async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await companyService.getStats(req.user!.companyId!);
      sendSuccess(res, stats);
    } catch (err: any) { sendError(res, err.message); }
  },
};
