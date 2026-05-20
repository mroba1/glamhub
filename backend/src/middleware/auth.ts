import { Request, Response, NextFunction } from "express";
import { verifyToken, fail } from "../utils";

export interface Req extends Request {
  user?: { userId: string; role: string; companyId?: string };
}

export const authenticate = (req: Req, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return fail(res, "No token provided", 401);
  try {
    req.user = verifyToken(header.split(" ")[1]);
    next();
  } catch {
    fail(res, "Invalid or expired token", 401);
  }
};

export const requireRole = (...roles: string[]) =>
  (req: Req, res: Response, next: NextFunction) => {
    if (!req.user) return fail(res, "Unauthorized", 401);
    if (!roles.includes(req.user.role)) return fail(res, "Forbidden", 403);
    next();
  };

export const isSuperAdmin = requireRole("SUPER_ADMIN");
export const isAdmin       = requireRole("ADMIN", "SUPER_ADMIN");
export const isCustomer    = requireRole("CUSTOMER", "ADMIN", "SUPER_ADMIN");
