import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { errorHandler, notFound } from "./middleware/error.middleware";

// Routes
import authRoutes         from "./modules/auth/auth.routes";
import companyRoutes      from "./modules/companies/company.routes";
import bookingRoutes      from "./modules/bookings/booking.routes";
import serviceRoutes      from "./modules/services/service.routes";
import categoryRoutes     from "./modules/categories/category.routes";
import productRoutes      from "./modules/products/product.routes";
import orderRoutes        from "./modules/orders/order.routes";
import subscriptionRoutes from "./modules/subscriptions/subscription.routes";
import notificationRoutes from "./modules/notifications/notification.routes";

const app = express();

// ── Security ──────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: [env.FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));

// ── Rate limiting ─────────────────────────────────────────
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: "Too many requests" } }));
app.use("/api",      rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// ── Body parsing ──────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Static file serving (uploaded images) ─────────────────
app.use("/uploads", express.static(path.join(process.cwd(), env.UPLOAD_DIR)));

// ── Health check ──────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Glam Hub API is running", version: "1.0.0", timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/companies",     companyRoutes);
app.use("/api/bookings",      bookingRoutes);
app.use("/api/services",      serviceRoutes);
app.use("/api/categories",    categoryRoutes);
app.use("/api/products",      productRoutes);
app.use("/api/orders",        orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/notifications", notificationRoutes);

// ── 404 + Error handler ───────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────
app.listen(env.PORT, () => {
  console.log(`
  ╔════════════════════════════════════╗
  ║   Glam Hub API                     ║
  ║   http://localhost:${env.PORT}           ║
  ║   ENV: ${env.NODE_ENV.padEnd(27)}║
  ╚════════════════════════════════════╝
  `);
});

export default app;
