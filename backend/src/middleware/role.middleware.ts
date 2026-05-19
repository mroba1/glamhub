import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { sendError } from "../utils/response";

export const requireRole = (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) { sendError(res, "Unauthorized", 401); return; }
    if (!roles.includes(req.user.role)) {
      sendError(res, "Forbidden. Insufficient permissions.", 403);
      return;
    }
    next();
  };

export const requireSuperAdmin = requireRole("SUPER_ADMIN");
export const requireAdmin      = requireRole("ADMIN", "SUPER_ADMIN");
export const requireCustomer   = requireRole("CUSTOMER", "ADMIN", "SUPER_ADMIN");
