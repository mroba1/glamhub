import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { Response } from "express";

// ── JWT ──────────────────────────────────────────────
export const signToken = (payload: object) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as any);

export const signRefresh = (payload: object) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as any);

export const verifyToken = (token: string): any =>
  jwt.verify(token, env.JWT_SECRET);

// ── Password ─────────────────────────────────────────
export const hashPassword = (p: string) => bcrypt.hash(p, 12);
export const comparePassword = (p: string, h: string) => bcrypt.compare(p, h);

// ── Response helpers ──────────────────────────────────
export const ok = (res: Response, data: any, message = "Success", status = 200) =>
  res.status(status).json({ success: true, message, data });

export const fail = (res: Response, message: string, status = 400, errors?: any) =>
  res.status(status).json({ success: false, message, errors });

// ── Generators ────────────────────────────────────────
export const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const generateId = (prefix = "") =>
  `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

export const generateBookingNumber = () => generateId("BK-");
export const generateOrderNumber   = () => generateId("ORD-");

export const normalizeCategory = (name: string) => name.toLowerCase().trim();
