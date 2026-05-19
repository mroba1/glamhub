import { Router } from "express";
import { companyController } from "./company.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { requireAdmin, requireSuperAdmin } from "../../middleware/role.middleware";

const router = Router();

// Public
router.get("/:slug/public", companyController.getBySlug);

// Admin — own company
router.get   ("/me/stats",    authenticate, requireAdmin, companyController.getStats);
router.get   ("/me/branding", authenticate, requireAdmin, companyController.getBranding);
router.patch ("/me/branding", authenticate, requireAdmin, companyController.updateBranding);
router.post  ("/me/logo",     authenticate, requireAdmin, ...(companyController.uploadLogo as any[]));
router.post  ("/me/banner",   authenticate, requireAdmin, ...(companyController.uploadBanner as any[]));
router.post  ("/me/gallery",  authenticate, requireAdmin, ...(companyController.uploadGallery as any[]));

// Super admin
router.get   ("/",            authenticate, requireSuperAdmin, companyController.getAll);
router.patch ("/:id/status",  authenticate, requireSuperAdmin, companyController.updateStatus);

export default router;
