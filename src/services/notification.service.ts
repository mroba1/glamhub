import { api } from "@/lib/api";

export const notificationService = {
  async getMyNotifications() {
    return api("/notifications");
  },

  async markAsRead(id: string) {
    return api(`/notifications/${id}/read`, { method: "PATCH" });
  },

  async markAllAsRead() {
    return api("/notifications/read-all", { method: "PATCH" });
  },

  async deleteNotification(id: string) {
    return api(`/notifications/${id}`, { method: "DELETE" });
  },

  async broadcast(payload: { title: string; message: string; targetRole?: string }) {
    return api("/notifications/broadcast", { method: "POST", body: JSON.stringify(payload) });
  },
};
