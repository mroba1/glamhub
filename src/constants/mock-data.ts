import type {
  Product,
  Booking,
  Order,
  Company,
  Category,
  Notification,
  Service,
  Customer,
  SubscriptionPlan,
  Subscription,
  Template,
  CompanyBranding,
  Payment,
  SecurityLog,
  AdminService,
  Invite,
} from "@/types";

// ===== CATEGORIES (kept — needed for UI structure) =====
export const MOCK_CATEGORIES: Category[] = [
  { id: "c1", name: "Hair Care",  slug: "hair-care",  productCount: 0, isActive: true, createdAt: "2024-01-01" },
  { id: "c2", name: "Skin Care",  slug: "skin-care",  productCount: 0, isActive: true, createdAt: "2024-01-01" },
  { id: "c3", name: "Nail Care",  slug: "nail-care",  productCount: 0, isActive: true, createdAt: "2024-01-01" },
  { id: "c4", name: "Makeup",     slug: "makeup",     productCount: 0, isActive: true, createdAt: "2024-01-01" },
  { id: "c5", name: "Fragrance",  slug: "fragrance",  productCount: 0, isActive: true, createdAt: "2024-01-01" },
  { id: "c6", name: "Body Care",  slug: "body-care",  productCount: 0, isActive: true, createdAt: "2024-01-01" },
  { id: "c7", name: "Lashes",     slug: "lashes",     productCount: 0, isActive: true, createdAt: "2024-01-01" },
];

// ===== PRODUCTS — empty =====
export const MOCK_PRODUCTS: Product[] = [];

// ===== SERVICES (kept — needed for booking flow) =====
export const MOCK_SERVICES: Service[] = [
  {
    id: "s1",
    name: "Classic Hair Treatment",
    description: "Deep conditioning and styling treatment for all hair types.",
    duration: 90,
    price: 12000,
    categoryId: "c1",
    categoryName: "Hair Care",
    companyId: "co1",
    companyName: "Glam Studio Lagos",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
    isActive: true,
  },
  {
    id: "s2",
    name: "Luxury Facial",
    description: "90-minute deep cleansing and rejuvenating facial treatment.",
    duration: 90,
    price: 18000,
    categoryId: "c2",
    categoryName: "Skin Care",
    companyId: "co1",
    companyName: "Glam Studio Lagos",
    imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400",
    isActive: true,
  },
  {
    id: "s3",
    name: "Gel Manicure & Pedicure",
    description: "Complete nail care with gel polish that lasts up to 3 weeks.",
    duration: 120,
    price: 9500,
    categoryId: "c3",
    categoryName: "Nail Care",
    companyId: "co1",
    companyName: "Glam Studio Lagos",
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400",
    isActive: true,
  },
  {
    id: "s4",
    name: "Bridal Makeup",
    description: "Full glam bridal makeup application with false lashes.",
    duration: 180,
    price: 45000,
    categoryId: "c4",
    categoryName: "Makeup",
    companyId: "co2",
    companyName: "Beauty House Abuja",
    imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400",
    isActive: true,
  },
  {
    id: "s5",
    name: "Lash Extensions",
    description: "Volume or classic lash extensions for a dramatic eye look.",
    duration: 150,
    price: 25000,
    categoryId: "c7",
    categoryName: "Lashes",
    companyId: "co1",
    companyName: "Glam Studio Lagos",
    imageUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400",
    isActive: true,
  },
];

// ===== BOOKINGS — empty =====
export const MOCK_BOOKINGS: Booking[] = [];

// ===== ORDERS — empty =====
export const MOCK_ORDERS: Order[] = [];

// MOCK_COMPANIES defined below with demo data

// ===== CUSTOMERS — empty =====
export const MOCK_CUSTOMERS: Customer[] = [];

// ===== NOTIFICATIONS — empty =====
export const MOCK_NOTIFICATIONS: Notification[] = [];

// ===== ANALYTICS — all zeros =====
export const MOCK_ANALYTICS = {
  totalRevenue: 0,
  totalBookings: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalCompanies: 0,
  totalProducts: 0,
  revenueGrowth: 0,
  bookingGrowth: 0,
  orderGrowth: 0,
  customerGrowth: 0,
  subscriptionRevenue: 0,
  activeSubscriptions: 0,
  expiredSubscriptions: 0,
  pendingSubscriptions: 0,
  revenueChart: [
    { label: "Jan", value: 0, secondary: 0 },
    { label: "Feb", value: 0, secondary: 0 },
    { label: "Mar", value: 0, secondary: 0 },
    { label: "Apr", value: 0, secondary: 0 },
    { label: "May", value: 0, secondary: 0 },
    { label: "Jun", value: 0, secondary: 0 },
    { label: "Jul", value: 0, secondary: 0 },
    { label: "Aug", value: 0, secondary: 0 },
  ],
};

// ===== SUBSCRIPTION PLANS (kept — needed for billing flow) =====
export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "plan_starter",
    name: "Starter",
    description: "Perfect for small salons just getting started",
    monthlyPrice: 15000,
    yearlyPrice: 150000,
    maxProducts: 20,
    maxBookingsPerMonth: 50,
    features: [
      "Up to 20 products",
      "50 bookings/month",
      "Basic analytics",
      "Customer management",
      "Email notifications",
    ],
  },
  {
    id: "plan_growth",
    name: "Growth",
    description: "For growing salons with expanding clientele",
    monthlyPrice: 35000,
    yearlyPrice: 350000,
    maxProducts: 100,
    maxBookingsPerMonth: 200,
    isPopular: true,
    features: [
      "Up to 100 products",
      "200 bookings/month",
      "Advanced analytics",
      "Customer management",
      "Priority notifications",
      "Custom promotions",
      "Multiple staff accounts",
    ],
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    description: "For large salons and multi-branch operations",
    monthlyPrice: 75000,
    yearlyPrice: 750000,
    maxProducts: 500,
    maxBookingsPerMonth: 99999,
    features: [
      "Unlimited products",
      "Unlimited bookings",
      "Full analytics suite",
      "Dedicated account manager",
      "API access",
      "Custom branding",
      "Multi-location support",
      "Priority support (24/7)",
    ],
  },
];

// ===== SUBSCRIPTIONS — empty =====
export const MOCK_SUBSCRIPTIONS: Subscription[] = [];

// ===== COMPANIES (for mini-site demo) =====
export const MOCK_COMPANIES: Company[] = [
  {
    id: "co1",
    name: "Glam Parlor",
    slug: "glam-parlor",
    description: "Lagos premier luxury beauty studio offering world-class services.",
    email: "hello@glamparlor.ng",
    phone: "08012345678",
    address: "25 Admiralty Way, Lekki Phase 1",
    city: "Lagos",
    state: "Lagos",
    status: "active",
    adminId: "a1",
    totalProducts: 0,
    totalBookings: 0,
    rating: 0,
    reviewCount: 0,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "co2",
    name: "Beauty by Annie",
    slug: "beauty-by-annie",
    description: "Premium beauty and wellness services tailored for the modern woman.",
    email: "annie@beautybyannie.ng",
    phone: "09087654321",
    address: "10 Wuse Zone 5",
    city: "Abuja",
    state: "FCT",
    status: "active",
    adminId: "a2",
    totalProducts: 0,
    totalBookings: 0,
    rating: 0,
    reviewCount: 0,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "co3",
    name: "Nail Zone PH",
    slug: "nail-zone-ph",
    description: "Specialist nail art and care studio in Port Harcourt.",
    email: "info@nailzoneph.ng",
    phone: "08034567890",
    address: "12 Ada George Road",
    city: "Port Harcourt",
    state: "Rivers",
    status: "pending",
    adminId: "a3",
    totalProducts: 0,
    totalBookings: 0,
    rating: 0,
    reviewCount: 0,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
  },
];

// ===== COMPANY BRANDING (default for admin customization page) =====
export const DEFAULT_COMPANY_BRANDING: CompanyBranding = {
  companyId: "co1",
  logoUrl: "",
  bannerUrl: "",
  primaryColor: "#10b981",
  secondaryColor: "#064e3b",
  businessName: "Glam Parlor",
  tagline: "Your beauty, our passion",
  about: "We are a premium beauty salon dedicated to making every client look and feel their best.",
  phone: "08012345678",
  email: "hello@glamparlor.ng",
  address: "25 Admiralty Way, Lekki Phase 1, Lagos",
  openingHours: [
    { day: "Monday",    open: "09:00", close: "18:00", closed: false },
    { day: "Tuesday",   open: "09:00", close: "18:00", closed: false },
    { day: "Wednesday", open: "09:00", close: "18:00", closed: false },
    { day: "Thursday",  open: "09:00", close: "18:00", closed: false },
    { day: "Friday",    open: "09:00", close: "19:00", closed: false },
    { day: "Saturday",  open: "10:00", close: "17:00", closed: false },
    { day: "Sunday",    open: "00:00", close: "00:00", closed: true  },
  ],
  socialLinks: {
    instagram: "",
    tiktok: "",
    whatsapp: "",
    facebook: "",
  },
  sections: {
    showMarketplace: true,
    showBooking: true,
    showTestimonials: true,
    showFeaturedServices: true,
    showGallery: false,
  },
  gallery: [],
  templateId: "tpl1",
};

// ===== TEMPLATES =====
export const MOCK_TEMPLATES: Template[] = [
  {
    id: "tpl1",
    name: "Luxe Beauty",
    description: "Elegant dark-themed template for premium beauty salons",
    category: "beauty",
    thumbnailUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
    isActive: true,
    isPremium: false,
    usageCount: 0,
    createdAt: "2024-01-01",
  },
  {
    id: "tpl2",
    name: "Fresh & Clean",
    description: "Minimalist white-themed template for modern salons",
    category: "salon",
    thumbnailUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400",
    isActive: true,
    isPremium: false,
    usageCount: 0,
    createdAt: "2024-01-01",
  },
  {
    id: "tpl3",
    name: "Spa Serene",
    description: "Calm, nature-inspired template for spas and wellness centres",
    category: "spa",
    thumbnailUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400",
    isActive: true,
    isPremium: true,
    usageCount: 0,
    createdAt: "2024-01-01",
  },
  {
    id: "tpl4",
    name: "Nail Studio",
    description: "Bold, colourful template built specifically for nail studios",
    category: "nails",
    thumbnailUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400",
    isActive: true,
    isPremium: false,
    usageCount: 0,
    createdAt: "2024-01-02",
  },
  {
    id: "tpl5",
    name: "Barber Pro",
    description: "Sharp, masculine template for barber shops",
    category: "barber",
    thumbnailUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
    isActive: false,
    isPremium: true,
    usageCount: 0,
    createdAt: "2024-01-03",
  },
];

// ===== PAYMENTS (subscription payment review) =====
export const MOCK_PAYMENTS: Payment[] = [];

// ===== SECURITY LOGS =====
export const MOCK_SECURITY_LOGS: SecurityLog[] = [];

// ===== ADMIN SERVICES (salon services managed by admin) =====
export const MOCK_ADMIN_SERVICES: AdminService[] = [];

// ===== INVITES =====
export const MOCK_INVITES: Invite[] = [];
