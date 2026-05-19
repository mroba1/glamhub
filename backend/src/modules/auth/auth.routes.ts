import { Router } from "express";
import { authController } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register",         authController.register);
router.post("/login",            authController.login);
router.get ("/profile",          authenticate, authController.getProfile);
router.patch("/profile",         authenticate, authController.updateProfile);
router.patch("/change-password", authenticate, authController.changePassword);
router.post ("/avatar",          authenticate, ...(authController.uploadAvatar as any[]));

export default router;
