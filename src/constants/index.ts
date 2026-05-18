export const APP_NAME = "Glam Hub";
export const APP_TAGLINE = "Beauty You Can See and Feel";
export const APP_DESCRIPTION =
  "The ultimate multi-tenant beauty platform for salon bookings and premium products";

export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Customer
  BOOKING: "/booking",
  MARKETPLACE: "/marketplace",
  CART: "/cart",
  ORDERS: "/orders",
  PROFILE: "/profile",
  NOTIFICATIONS: "/notifications",
  BOOKING_HISTORY: "/booking-history",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_APPOINTMENTS: "/admin/appointments",
  ADMIN_BOOKINGS: "/admin/bookings",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_CUSTOMERS: "/admin/customers",
  ADMIN_NOTIFICATIONS: "/admin/notifications",
  ADMIN_SETTINGS: "/admin/settings",

  // Super Admin
  SUPER_ADMIN_ANALYTICS: "/super-admin/analytics",
  SUPER_ADMIN_COMPANIES: "/super-admin/companies",
  SUPER_ADMIN_PRODUCTS: "/super-admin/products",
  SUPER_ADMIN_CATEGORIES: "/super-admin/categories",
  SUPER_ADMIN_SETTINGS: "/super-admin/settings",
} as const;

export const BOOKING_STATUSES = [
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "approved", label: "Approved", color: "green" },
  { value: "rejected", label: "Rejected", color: "red" },
  { value: "completed", label: "Completed", color: "blue" },
  { value: "cancelled", label: "Cancelled", color: "gray" },
] as const;

export const ORDER_STATUSES = [
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "processing", label: "Processing", color: "purple" },
  { value: "shipped", label: "Shipped", color: "cyan" },
  { value: "delivered", label: "Delivered", color: "green" },
  { value: "cancelled", label: "Cancelled", color: "gray" },
  { value: "refunded", label: "Refunded", color: "orange" },
] as const;

export const COMPANY_STATUSES = [
  { value: "active", label: "Active", color: "green" },
  { value: "inactive", label: "Inactive", color: "gray" },
  { value: "suspended", label: "Suspended", color: "red" },
  { value: "pending", label: "Pending Review", color: "yellow" },
] as const;

export const TIME_SLOTS = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
];

export const ITEMS_PER_PAGE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_PRODUCT_IMAGES = 5;

export const CUSTOMER_NAV_ITEMS = [
  { label: "Home", href: ROUTES.HOME, icon: "Home" },
  { label: "Book", href: ROUTES.BOOKING, icon: "Calendar" },
  { label: "Shop", href: ROUTES.MARKETPLACE, icon: "ShoppingBag" },
  { label: "Orders", href: ROUTES.ORDERS, icon: "Package" },
  { label: "Profile", href: ROUTES.PROFILE, icon: "User" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: "LayoutDashboard" },
  { label: "Appointments", href: ROUTES.ADMIN_APPOINTMENTS, icon: "Calendar" },
  { label: "Bookings", href: ROUTES.ADMIN_BOOKINGS, icon: "BookOpen" },
  { label: "Products", href: ROUTES.ADMIN_PRODUCTS, icon: "Package" },
  { label: "Categories", href: ROUTES.ADMIN_CATEGORIES, icon: "Tag" },
  { label: "Customers", href: ROUTES.ADMIN_CUSTOMERS, icon: "Users" },
  { label: "Notifications", href: ROUTES.ADMIN_NOTIFICATIONS, icon: "Bell" },
  { label: "Settings", href: ROUTES.ADMIN_SETTINGS, icon: "Settings" },
] as const;

export const SUPER_ADMIN_NAV_ITEMS = [
  { label: "Analytics", href: ROUTES.SUPER_ADMIN_ANALYTICS, icon: "BarChart3" },
  { label: "Companies", href: ROUTES.SUPER_ADMIN_COMPANIES, icon: "Building2" },
  { label: "Products", href: ROUTES.SUPER_ADMIN_PRODUCTS, icon: "Package" },
  { label: "Categories", href: ROUTES.SUPER_ADMIN_CATEGORIES, icon: "Tag" },
  { label: "Settings", href: ROUTES.SUPER_ADMIN_SETTINGS, icon: "Settings" },
] as const;
