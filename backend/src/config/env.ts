import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT:                  parseInt(process.env.PORT ?? "5000"),
  NODE_ENV:              process.env.NODE_ENV ?? "development",
  DATABASE_URL:          process.env.DATABASE_URL ?? "",
  JWT_SECRET:            process.env.JWT_SECRET ?? "dev-secret",
  JWT_EXPIRES_IN:        process.env.JWT_EXPIRES_IN ?? "7d",
  JWT_REFRESH_SECRET:    process.env.JWT_REFRESH_SECRET ?? "dev-refresh-secret",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d",
  FRONTEND_URL:          process.env.FRONTEND_URL ?? "http://localhost:3000",
  UPLOAD_DIR:            process.env.UPLOAD_DIR ?? "uploads",
  MAX_FILE_SIZE:         parseInt(process.env.MAX_FILE_SIZE ?? "5242880"),
  SMTP_HOST:             process.env.SMTP_HOST ?? "",
  SMTP_PORT:             parseInt(process.env.SMTP_PORT ?? "587"),
  SMTP_USER:             process.env.SMTP_USER ?? "",
  SMTP_PASS:             process.env.SMTP_PASS ?? "",
  SMTP_FROM:             process.env.SMTP_FROM ?? "Glam Hub <noreply@glamhub.ng>",
  SUPER_ADMIN_EMAIL:     process.env.SUPER_ADMIN_EMAIL ?? "super@glamhub.ng",
  SUPER_ADMIN_PASSWORD:  process.env.SUPER_ADMIN_PASSWORD ?? "SuperAdmin@2024",
  SUPER_ADMIN_NAME:      process.env.SUPER_ADMIN_NAME ?? "Glam Hub Admin",
};
