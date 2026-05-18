import type { ApiResponse, User, UserRole } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  address?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// Placeholder — replace with real HTTP calls
export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    await new Promise((r) => setTimeout(r, 800));
    return {
      success: true,
      data: {
        user: {
          id: "u1",
          name: "Adaeze Okonkwo",
          email: payload.email,
          role: "customer",
          loyaltyPoints: 0,
          totalOrders: 0,
          totalBookings: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as User,
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      },
      message: "Login successful",
    };
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    await new Promise((r) => setTimeout(r, 1000));
    return {
      success: true,
      data: {
        user: {
          id: "new-user",
          name: payload.name,
          email: payload.email,
          role: payload.role ?? "customer",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as User,
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
      },
      message: "Account created successfully",
    };
  },

  async logout(): Promise<ApiResponse<null>> {
    await new Promise((r) => setTimeout(r, 300));
    return { success: true, message: "Logged out successfully" };
  },

  async getProfile(): Promise<ApiResponse<User>> {
    await new Promise((r) => setTimeout(r, 500));
    return {
      success: true,
      data: {
        id: "u1",
        name: "Adaeze Okonkwo",
        email: "adaeze@email.com",
        phone: "08012345678",
        role: "customer",
        createdAt: "2024-01-15",
        updatedAt: "2024-03-20",
      },
    };
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<User>> {
    await new Promise((r) => setTimeout(r, 700));
    return { success: true, message: "Profile updated successfully", data: {} as User };
  },

  async changePassword(payload: ChangePasswordPayload): Promise<ApiResponse<null>> {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, message: "Password changed successfully" };
  },

  async uploadAvatar(file: File): Promise<ApiResponse<{ url: string }>> {
    await new Promise((r) => setTimeout(r, 1200));
    return {
      success: true,
      data: { url: URL.createObjectURL(file) },
      message: "Avatar uploaded successfully",
    };
  },
};
