import type { ApiResponse, PaginatedResponse, Subscription, SubscriptionPlan, SubscriptionStatus } from "@/types";

export interface CreateSubscriptionPayload {
  companyId: string;
  planId: string;
  interval: "monthly" | "yearly";
}

export interface UploadSubscriptionPaymentPayload {
  subscriptionId: string;
  file: File;
  paymentReference: string;
}

export interface ReviewSubscriptionPayload {
  subscriptionId: string;
  action: "approve" | "reject";
  note?: string;
}

// Placeholder — replace with real HTTP calls
export const subscriptionService = {
  async getPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    await new Promise((r) => setTimeout(r, 400));
    const { MOCK_SUBSCRIPTION_PLANS } = await import("@/constants/mock-data");
    return { success: true, data: MOCK_SUBSCRIPTION_PLANS };
  },

  async getMySubscription(companyId: string): Promise<ApiResponse<Subscription | null>> {
    await new Promise((r) => setTimeout(r, 400));
    const { MOCK_SUBSCRIPTIONS } = await import("@/constants/mock-data");
    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.companyId === companyId) ?? null;
    return { success: true, data: sub };
  },

  async createSubscription(payload: CreateSubscriptionPayload): Promise<ApiResponse<Subscription>> {
    await new Promise((r) => setTimeout(r, 700));
    return {
      success: true,
      data: {} as Subscription,
      message: "Subscription initiated. Please upload your payment proof.",
    };
  },

  async uploadPaymentProof(payload: UploadSubscriptionPaymentPayload): Promise<ApiResponse<{ url: string }>> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      success: true,
      data: { url: URL.createObjectURL(payload.file) },
      message: "Payment proof uploaded. Awaiting Super Admin review.",
    };
  },

  // Super Admin
  async getAllSubscriptions(): Promise<ApiResponse<PaginatedResponse<Subscription>>> {
    await new Promise((r) => setTimeout(r, 500));
    const { MOCK_SUBSCRIPTIONS } = await import("@/constants/mock-data");
    return {
      success: true,
      data: {
        data: MOCK_SUBSCRIPTIONS,
        total: MOCK_SUBSCRIPTIONS.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      },
    };
  },

  async reviewSubscription(payload: ReviewSubscriptionPayload): Promise<ApiResponse<Subscription>> {
    await new Promise((r) => setTimeout(r, 700));
    return {
      success: true,
      data: {} as Subscription,
      message: `Subscription ${payload.action === "approve" ? "approved" : "rejected"} successfully`,
    };
  },

  async updatePlan(planId: string, payload: Partial<SubscriptionPlan>): Promise<ApiResponse<SubscriptionPlan>> {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, data: {} as SubscriptionPlan, message: "Plan updated" };
  },

  async cancelSubscription(subscriptionId: string): Promise<ApiResponse<null>> {
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, message: "Subscription cancelled" };
  },
};
