import { prisma } from "../../config/database";
import { generateBookingNumber } from "../../utils/response";
import { BookingStatus } from "@prisma/client";

export const bookingService = {
  async create(data: { customerId: string; serviceId: string; companyId: string; date: string; timeSlot: string; notes?: string }) {
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service) throw new Error("Service not found");
    if (!service.isActive) throw new Error("Service is not available");

    return prisma.booking.create({
      data: { ...data, bookingNumber: generateBookingNumber() },
      include: { service: true, customer: { select: { id: true, name: true, email: true, phone: true } } },
    });
  },

  async getMyBookings(customerId: string, query: { status?: string; page?: number; limit?: number }) {
    const { status, page = 1, limit = 10 } = query;
    const where: any = { customerId };
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      prisma.booking.findMany({ where, skip: (page - 1) * limit, take: limit, include: { service: true, company: { select: { name: true, slug: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.booking.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getCompanyBookings(companyId: string, query: { status?: string; page?: number; limit?: number; search?: string }) {
    const { status, page = 1, limit = 10, search } = query;
    const where: any = { companyId };
    if (status) where.status = status;
    if (search) where.customer = { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] };
    const [data, total] = await Promise.all([
      prisma.booking.findMany({ where, skip: (page - 1) * limit, take: limit, include: { service: true, customer: { select: { id: true, name: true, email: true, phone: true } } }, orderBy: { createdAt: "desc" } }),
      prisma.booking.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async updateStatus(id: string, status: BookingStatus, adminNote?: string, companyId?: string) {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new Error("Booking not found");
    if (companyId && booking.companyId !== companyId) throw new Error("Forbidden");

    const updated = await prisma.booking.update({
      where: { id },
      data:  { status, ...(adminNote && { adminNote }) },
      include: { customer: { select: { id: true, name: true, email: true } }, service: true },
    });

    // Create notification for customer
    await prisma.notification.create({
      data: {
        userId:  updated.customer.id,
        type:    `booking_${status.toLowerCase()}`,
        title:   status === "APPROVED" ? "Booking Approved!" : status === "REJECTED" ? "Booking Rejected" : `Booking ${status}`,
        message: status === "APPROVED"
          ? `Your ${updated.service.name} appointment on ${updated.date} at ${updated.timeSlot} has been approved.`
          : `Your ${updated.service.name} booking has been ${status.toLowerCase()}.`,
        metadata: { bookingId: id, bookingNumber: updated.bookingNumber },
      },
    });

    return updated;
  },

  async uploadPaymentProof(bookingId: string, url: string, customerId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");
    if (booking.customerId !== customerId) throw new Error("Forbidden");
    return prisma.booking.update({ where: { id: bookingId }, data: { paymentProofUrl: url } });
  },
};
