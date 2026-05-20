import { api, apiUpload } from "@/lib/api";

export const orderService = {
  async createOrder(payload: { items: { productId: string; quantity: number }[]; companyId: string; shippingAddress: string; notes?: string }) {
    return api("/orders", { method: "POST", body: JSON.stringify(payload) });
  },

  async getMyOrders(params?: { page?: number }) {
    const q = new URLSearchParams(params as any).toString();
    return api(`/orders/my${q ? `?${q}` : ""}`);
  },

  async uploadOrderPayment(orderId: string, file: File) {
    const form = new FormData();
    form.append("proof", file);
    return apiUpload(`/orders/${orderId}/payment`, form);
  },

  // Admin
  async getCompanyOrders(params?: { page?: number; status?: string }) {
    const q = new URLSearchParams(params as any).toString();
    return api(`/orders/company${q ? `?${q}` : ""}`);
  },

  async updateOrderStatus(id: string, status: string) {
    return api(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
  },
};
