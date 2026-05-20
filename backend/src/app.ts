import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";

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

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: (origin, callback) => {
    // Allow all Vercel deployments, localhost, and the configured frontend URL
    const allowed = [
      env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:3001",
      "https://glamhub-ypsy.vercel.app",
      "https://glamhub-two.vercel.app",
    ];
    if (!origin || allowed.includes(origin) || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Rate limiting
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, max: 30 }));
app.use("/api",      rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Static file serving
app.use("/uploads", express.static(path.join(process.cwd(), env.UPLOAD_DIR)));

// Health check
app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Glam Hub API running", version: "1.0.0" });
});

// Routes
app.use("/api/auth",          authRoutes);
app.use("/api/companies",     companyRoutes);
app.use("/api/bookings",      bookingRoutes);
app.use("/api/services",      serviceRoutes);
app.use("/api/categories",    categoryRoutes);
app.use("/api/products",      productRoutes);
app.use("/api/orders",        orderRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/notifications", notificationRoutes);

// 404
app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// Error handler
app.use((err: Error, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error", ...(env.NODE_ENV === "development" && { error: err.message }) });
});

app.listen(env.PORT, () => {
  console.log(`✅ Glam Hub API running on port ${env.PORT}`);
});

export default app;
