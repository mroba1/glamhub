import { api, apiUpload } from "@/lib/api";

export const productService = {
  async getProducts(companyId: string, params?: { search?: string; categoryId?: string; page?: number }) {
    const q = new URLSearchParams(params as any).toString();
    return api(`/products/public/${companyId}${q ? `?${q}` : ""}`);
  },

  async getProductById(companyId: string, id: string) {
    return api(`/products/public/${companyId}/${id}`);
  },

  async getCategories() {
    return api("/categories/global");
  },

  // Admin
  async getMyProducts() {
    return api("/products");
  },

  async createProduct(formData: FormData) {
    return apiUpload("/products", formData);
  },

  async updateProduct(id: string, formData: FormData) {
    const token = localStorage.getItem("glamhub_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://glamhub.onrender.com/api"}/products/${id}`, {
      method: "PATCH",
      headers: { ...(token && { Authorization: `Bearer ${token}` }) },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async deleteProduct(id: string) {
    return api(`/products/${id}`, { method: "DELETE" });
  },

  async getAdminCategories() {
    return api("/categories");
  },

  async createCategory(payload: { name: string }) {
    return api("/categories", { method: "POST", body: JSON.stringify(payload) });
  },

  async deleteCategory(id: string) {
    return api(`/categories/${id}`, { method: "DELETE" });
  },
};
