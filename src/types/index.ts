// ===== USER & AUTH =====
export type UserRole = "customer" | "admin" | "super_admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer extends User {
  role: "customer";
  address?: string;
  loyaltyPoints: number;
  totalOrders: number;
  totalBookings: number;
}

export interface Admin extends User {
  role: "admin";
  companyId: string;
  companyName: string;
  permissions: string[];
}

export interface SuperAdmin extends User {
  role: "super_admin";
}

// ===== SUBSCRIPTION =====
export type SubscriptionInterval = "monthly" | "yearly";
export type SubscriptionStatus = "active" | "expired" | "pending_payment" | "cancelled" | "trial";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  isPopular?: boolean;
  maxProducts: number;
  maxBookingsPerMonth: number;
}

export interface Subscription {
  id: string;
  companyId: string;
  companyName: string;
  planId: string;
  planName: string;
  interval: SubscriptionInterval;
  status: SubscriptionStatus;
  amount: number;
  startDate: string;
  endDate: string;
  paymentProofUrl?: string;
  paymentReference?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  daysRemaining?: number;
}

// ===== COMPANY =====
export type CompanyStatus = "active" | "inactive" | "suspended" | "pending";

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  status: CompanyStatus;
  adminId: string;
  totalProducts: number;
  totalBookings: number;
  rating: number;
  reviewCount: number;
  subscription?: Subscription;
  createdAt: string;
  updatedAt: string;
}

// ===== CATEGORY =====
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
}

// ===== PRODUCT =====
export type ProductStatus = "active" | "inactive" | "out_of_stock";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  categoryId: string;
  categoryName: string;
  companyId: string;
  companyName: string;
  stock: number;
  sku: string;
  status: ProductStatus;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// ===== CART =====
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  companyId: string;
  companyName: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  discount: number;
  total: number;
}

// ===== ORDER =====
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentProofUrl?: string;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== SERVICE / BOOKING =====
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  categoryId: string;
  categoryName: string;
  companyId: string;
  companyName: string;
  imageUrl?: string;
  isActive: boolean;
}

export type TimeSlot = {
  time: string;
  available: boolean;
};

export type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled";

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  companyId: string;
  companyName: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  paymentProofUrl?: string;
  notes?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== NOTIFICATION =====
export type NotificationType =
  | "booking_approved"
  | "booking_rejected"
  | "booking_reset"
  | "payment_confirmed"
  | "order_update"
  | "system";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, string>;
  createdAt: string;
}

// ===== ANALYTICS =====
export interface AnalyticsMetric {
  label: string;
  value: number | string;
  change: number;
  changeType: "increase" | "decrease" | "neutral";
}

export interface ChartDataPoint {
  label: string;
  value: number;
  secondary?: number;
}

// ===== PAGINATION =====
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  categoryId?: string;
}

// ===== INVITE =====
export type InviteStatus = "pending" | "used" | "expired";

export interface Invite {
  id: string;
  token: string;
  email?: string;
  note?: string;
  status: InviteStatus;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
  usedBy?: string;
  companyName?: string;
}

// ===== API =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ===== TEMPLATE =====
export type TemplateCategory = "beauty" | "salon" | "spa" | "nails" | "barber";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnailUrl: string;
  previewUrl?: string;
  isActive: boolean;
  isPremium: boolean;
  usageCount: number;
  createdAt: string;
}

// ===== COMPANY BRANDING =====
export interface OpeningHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface CompanyBranding {
  companyId: string;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  businessName: string;
  tagline: string;
  about: string;
  phone: string;
  email: string;
  address: string;
  openingHours: OpeningHour[];
  socialLinks: {
    instagram: string;
    tiktok: string;
    whatsapp: string;
    facebook: string;
  };
  sections: {
    showMarketplace: boolean;
    showBooking: boolean;
    showTestimonials: boolean;
    showFeaturedServices: boolean;
    showGallery: boolean;
  };
  gallery: string[];
  templateId: string;
}

// ===== SECURITY LOG =====
export type SecurityLogAction =
  | "login"
  | "logout"
  | "password_change"
  | "company_approved"
  | "company_suspended"
  | "subscription_approved"
  | "subscription_rejected"
  | "product_removed"
  | "admin_impersonated";

export interface SecurityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: SecurityLogAction;
  description: string;
  ipAddress: string;
  device: string;
  status: "success" | "failed" | "warning";
  createdAt: string;
}

// ===== PAYMENT (subscription payment review) =====
export type PaymentStatus = "pending" | "approved" | "rejected" | "re_upload_requested";

export interface Payment {
  id: string;
  companyId: string;
  companyName: string;
  planName: string;
  interval: "monthly" | "yearly";
  amount: number;
  screenshotUrl: string;
  reference: string;
  status: PaymentStatus;
  reviewNote?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// ===== ADMIN SERVICE (salon service) =====
export interface AdminService {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number;
  duration: number;
  imageUrl?: string;
  isActive: boolean;
  companyId: string;
  bookingCount: number;
  createdAt: string;
}
