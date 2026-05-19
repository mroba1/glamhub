import { prisma } from "../../config/database";
import { CompanyStatus } from "@prisma/client";

export const companyService = {
  async getAll(query: { search?: string; status?: string; page?: number; limit?: number }) {
    const { search, status, page = 1, limit = 20 } = query;
    const where: any = {};
    if (search) where.OR = [{ name: { contains: search, mode: "insensitive" } }, { city: { contains: search, mode: "insensitive" } }];
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      prisma.company.findMany({ where, skip: (page - 1) * limit, take: limit, include: { branding: true, subscription: { include: { plan: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.company.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getBySlug(slug: string) {
    return prisma.company.findUnique({
      where: { slug },
      include: { branding: true, services: { where: { isActive: true }, include: { category: true } }, subscription: true },
    });
  },

  async getById(id: string) {
    return prisma.company.findUnique({
      where: { id },
      include: { branding: true, subscription: { include: { plan: true } }, admin: { select: { id: true, name: true, email: true } } },
    });
  },

  async updateStatus(id: string, status: CompanyStatus, updatedBy: string) {
    return prisma.company.update({ where: { id }, data: { status } });
  },

  async getBranding(companyId: string) {
    return prisma.companyBranding.findUnique({ where: { companyId } });
  },

  async updateBranding(companyId: string, data: any) {
    return prisma.companyBranding.upsert({
      where:  { companyId },
      create: { companyId, ...data },
      update: data,
    });
  },

  async uploadLogo(companyId: string, url: string) {
    return prisma.companyBranding.upsert({
      where:  { companyId },
      create: { companyId, logoUrl: url },
      update: { logoUrl: url },
    });
  },

  async uploadBanner(companyId: string, url: string) {
    return prisma.companyBranding.upsert({
      where:  { companyId },
      create: { companyId, bannerUrl: url },
      update: { bannerUrl: url },
    });
  },

  async addGalleryImage(companyId: string, url: string) {
    const existing = await prisma.companyBranding.findUnique({ where: { companyId } });
    const gallery  = [...(existing?.gallery ?? []), url];
    return prisma.companyBranding.upsert({
      where:  { companyId },
      create: { companyId, gallery },
      update: { gallery },
    });
  },

  async getStats(companyId: string) {
    const [totalBookings, totalProducts, totalCustomers, totalOrders] = await Promise.all([
      prisma.booking.count({ where: { companyId } }),
      prisma.product.count({ where: { companyId } }),
      prisma.user.count({ where: { companyId, role: "CUSTOMER" } }),
      prisma.order.count({ where: { companyId } }),
    ]);
    return { totalBookings, totalProducts, totalCustomers, totalOrders };
  },
};
