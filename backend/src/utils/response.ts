import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
) =>
  res.status(statusCode).json({ success: true, message, data });

export const sendError = (
  res: Response,
  message: string,
  statusCode = 400,
  errors?: unknown
) =>
  res.status(statusCode).json({ success: false, message, errors });

export const generateOrderNumber = (): string =>
  `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

export const generateBookingNumber = (): string =>
  `BK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

export const slugify = (text: string): string =>
  text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const normalizeCategory = (name: string): string =>
  name.toLowerCase().trim();
