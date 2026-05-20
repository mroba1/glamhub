import { api, apiUpload } from "@/lib/api";

export const subscriptionService = {
  async getPlans() {
    return api("/subscriptions/plans");
  },

  async getMySubscription() {
    return api("/subscriptions/my");
  },

  async subscribe(payload: { planId: string; interval: string }) {
    return api("/subscriptions", { method: "POST", body: JSON.stringify(payload) });
  },

  async uploadPaymentProof(file: File, paymentReference: string) {
    const form = new FormData();
    form.append("proof", file);
    form.append("paymentReference", paymentReference);
    return apiUpload("/subscriptions/payment-proof", form);
  },

  // Super Admin
  async getAllSubscriptions() {
    return api("/subscriptions/all");
  },

  async getAllPayments() {
    return api("/subscriptions/payments");
  },

  async reviewPayment(id: string, action: "approve" | "reject", note?: string) {
    return api(`/subscriptions/payments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action, note }),
    });
  },
};
