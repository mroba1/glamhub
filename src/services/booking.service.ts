import type { ApiResponse, Booking, BookingStatus, PaginatedResponse, QueryParams, Service, TimeSlot } from "@/types";

export interface CreateBookingPayload {
  serviceId: string;
  date: string;
  timeSlot: string;
  notes?: string;
}

export interface UploadPaymentPayload {
  bookingId: string;
  file: File;
}

export interface UpdateBookingStatusPayload {
  bookingId: string;
  status: BookingStatus;
  adminNote?: string;
}

// Placeholder — replace with real HTTP calls
export const bookingService = {
  async getServices(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Service>>> {
    await new Promise((r) => setTimeout(r, 600));
    const { MOCK_SERVICES } = await import("@/constants/mock-data");
    return {
      success: true,
      data: {
        data: MOCK_SERVICES,
        total: MOCK_SERVICES.length,
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        totalPages: 1,
      },
    };
  },

  async getAvailableSlots(serviceId: string, date: string): Promise<ApiResponse<TimeSlot[]>> {
    await new Promise((r) => setTimeout(r, 500));
    const { TIME_SLOTS } = await import("@/constants");
    const slots: TimeSlot[] = TIME_SLOTS.map((time, i) => ({
      time,
      available: i !== 2 && i !== 5 && i !== 8,
    }));
    return { success: true, data: slots };
  },

  async createBooking(payload: CreateBookingPayload): Promise<ApiResponse<Booking>> {
    await new Promise((r) => setTimeout(r, 800));
    return {
      success: true,
      data: {} as Booking,
      message: "Booking created successfully. Please upload payment proof.",
    };
  },

  async getMyBookings(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    await new Promise((r) => setTimeout(r, 600));
    const { MOCK_BOOKINGS } = await import("@/constants/mock-data");
    return {
      success: true,
      data: {
        data: MOCK_BOOKINGS,
        total: MOCK_BOOKINGS.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
  },

  async getBookingById(id: string): Promise<ApiResponse<Booking>> {
    await new Promise((r) => setTimeout(r, 400));
    const { MOCK_BOOKINGS } = await import("@/constants/mock-data");
    const booking = MOCK_BOOKINGS.find((b) => b.id === id);
    return booking
      ? { success: true, data: booking }
      : { success: false, error: "Booking not found" };
  },

  async uploadPaymentProof(payload: UploadPaymentPayload): Promise<ApiResponse<{ url: string }>> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      success: true,
      data: { url: URL.createObjectURL(payload.file) },
      message: "Payment proof uploaded successfully",
    };
  },

  // Admin actions
  async getAllBookings(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    await new Promise((r) => setTimeout(r, 600));
    const { MOCK_BOOKINGS } = await import("@/constants/mock-data");
    return {
      success: true,
      data: { data: MOCK_BOOKINGS, total: MOCK_BOOKINGS.length, page: 1, limit: 10, totalPages: 1 },
    };
  },

  async updateBookingStatus(payload: UpdateBookingStatusPayload): Promise<ApiResponse<Booking>> {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, data: {} as Booking, message: `Booking ${payload.status} successfully` };
  },
};
