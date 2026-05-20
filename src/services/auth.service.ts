import { api, apiUpload, setToken, clearToken } from "@/lib/api";

export const authService = {
  async register(payload: {
    name: string; email: string; phone?: string; password: string;
    role?: string; businessName?: string; city?: string; state?: string; companyId?: string;
  }) {
    const res = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ ...payload, role: payload.role ?? "ADMIN" }),
    });
    if (res.data?.accessToken) setToken(res.data.accessToken);
    return res;
  },

  async login(payload: { email: string; password: string }) {
    const res = await api("/auth/login", { method: "POST", body: JSON.stringify(payload) });
    if (res.data?.accessToken) setToken(res.data.accessToken);
    return res;
  },

  async logout() {
    clearToken();
    return { success: true };
  },

  async getProfile() {
    return api("/auth/profile");
  },

  async updateProfile(payload: { name?: string; phone?: string }) {
    return api("/auth/profile", { method: "PATCH", body: JSON.stringify(payload) });
  },

  async changePassword(payload: { currentPassword: string; newPassword: string }) {
    return api("/auth/change-password", { method: "PATCH", body: JSON.stringify(payload) });
  },

  async uploadAvatar(file: File) {
    const form = new FormData();
    form.append("avatar", file);
    return apiUpload("/auth/avatar", form);
  },
};
