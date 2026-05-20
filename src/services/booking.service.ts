import { api, apiUpload } from "@/lib/api";

export const bookingService = {
  async getServices(companyId: string) {
    return api(`/services/public/${companyId}`);
  },

  async createBooking(payload: { serviceId: string; companyId: string; date: string; timeSlot: string; notes?: string }) {
    return api("/bookings", { method: "POST", body: JSON.stringify(payload) });
  },

  async getMyBookings(params?: { status?: string; page?: number }) {
    const q = new URLSearchParams(params as any).toString();
    return api(`/bookings/my${q ? `?${q}` : ""}`);
  },

  async uploadPaymentProof(bookingId: string, file: File) {
    const form = new FormData();
    form.append("proof", file);
    return apiUpload(`/bookings/${bookingId}/payment`, form);
  },

  async getCompanyBookings(params?: { status?: string; page?: number; search?: string }) {
    const q = new URLSearchParams(params as any).toString();
    return api(`/bookings/company${q ? `?${q}` : ""}`);
  },

  async updateBookingStatus(id: string, status: string, adminNote?: string) {
    return api(`/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, adminNote }) });
  },
};
