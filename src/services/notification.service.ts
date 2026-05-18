import type { ApiResponse, Notification, PaginatedResponse } from "@/types";

// Placeholder — replace with real HTTP calls
export const notificationService = {
  async getMyNotifications(): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    await new Promise((r) => setTimeout(r, 500));
    const { MOCK_NOTIFICATIONS } = await import("@/constants/mock-data");
    return {
      success: true,
      data: {
        data: MOCK_NOTIFICATIONS,
        total: MOCK_NOTIFICATIONS.length,
        page: 1,
        limit: 20,
        totalPages: 1,
      },
    };
  },

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    await new Promise((r) => setTimeout(r, 300));
    const { MOCK_NOTIFICATIONS } = await import("@/constants/mock-data");
    const count = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;
    return { success: true, data: { count } };
  },

  async markAsRead(id: string): Promise<ApiResponse<null>> {
    await new Promise((r) => setTimeout(r, 300));
    return { success: true, message: "Notification marked as read" };
  },

  async markAllAsRead(): Promise<ApiResponse<null>> {
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, message: "All notifications marked as read" };
  },

  async deleteNotification(id: string): Promise<ApiResponse<null>> {
    await new Promise((r) => setTimeout(r, 300));
    return { success: true, message: "Notification deleted" };
  },
};
