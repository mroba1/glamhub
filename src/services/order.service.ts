import type { ApiResponse, Cart, CartItem, Order, PaginatedResponse, QueryParams } from "@/types";

export interface CreateOrderPayload {
  items: { productId: string; quantity: number }[];
  shippingAddress: string;
  notes?: string;
}

// Placeholder — replace with real HTTP calls
export const orderService = {
  async getCart(): Promise<ApiResponse<Cart>> {
    await new Promise((r) => setTimeout(r, 400));
    return {
      success: true,
      data: { items: [], totalItems: 0, subtotal: 0, discount: 0, total: 0 },
    };
  },

  async addToCart(productId: string, quantity: number): Promise<ApiResponse<Cart>> {
    await new Promise((r) => setTimeout(r, 400));
    return { success: true, data: {} as Cart, message: "Item added to cart" };
  },

  async updateCartItem(itemId: string, quantity: number): Promise<ApiResponse<Cart>> {
    await new Promise((r) => setTimeout(r, 300));
    return { success: true, data: {} as Cart };
  },

  async removeCartItem(itemId: string): Promise<ApiResponse<Cart>> {
    await new Promise((r) => setTimeout(r, 300));
    return { success: true, data: {} as Cart, message: "Item removed from cart" };
  },

  async clearCart(): Promise<ApiResponse<null>> {
    await new Promise((r) => setTimeout(r, 300));
    return { success: true, message: "Cart cleared" };
  },

  async createOrder(payload: CreateOrderPayload): Promise<ApiResponse<Order>> {
    await new Promise((r) => setTimeout(r, 1000));
    return { success: true, data: {} as Order, message: "Order placed successfully" };
  },

  async uploadOrderPayment(orderId: string, file: File): Promise<ApiResponse<{ url: string }>> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      success: true,
      data: { url: URL.createObjectURL(file) },
      message: "Payment proof uploaded successfully",
    };
  },

  async getMyOrders(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Order>>> {
    await new Promise((r) => setTimeout(r, 600));
    const { MOCK_ORDERS } = await import("@/constants/mock-data");
    return {
      success: true,
      data: { data: MOCK_ORDERS, total: MOCK_ORDERS.length, page: 1, limit: 10, totalPages: 1 },
    };
  },

  async getOrderById(id: string): Promise<ApiResponse<Order>> {
    await new Promise((r) => setTimeout(r, 400));
    const { MOCK_ORDERS } = await import("@/constants/mock-data");
    const order = MOCK_ORDERS.find((o) => o.id === id);
    return order
      ? { success: true, data: order }
      : { success: false, error: "Order not found" };
  },

  // Admin
  async getAllOrders(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Order>>> {
    await new Promise((r) => setTimeout(r, 600));
    const { MOCK_ORDERS } = await import("@/constants/mock-data");
    return {
      success: true,
      data: { data: MOCK_ORDERS, total: MOCK_ORDERS.length, page: 1, limit: 10, totalPages: 1 },
    };
  },
};
