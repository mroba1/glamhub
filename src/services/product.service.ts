import type {
  ApiResponse,
  Category,
  PaginatedResponse,
  Product,
  QueryParams,
} from "@/types";

export interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  stock: number;
  sku: string;
  tags?: string[];
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  status?: "active" | "inactive";
}

export interface UploadProductImagesPayload {
  productId: string;
  files: File[];
}

// Placeholder — replace with real HTTP calls
export const productService = {
  async getProducts(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Product>>> {
    await new Promise((r) => setTimeout(r, 700));
    const { MOCK_PRODUCTS } = await import("@/constants/mock-data");
    let filtered = [...MOCK_PRODUCTS];
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (params?.categoryId) {
      filtered = filtered.filter((p) => p.categoryId === params.categoryId);
    }
    return {
      success: true,
      data: { data: filtered, total: filtered.length, page: 1, limit: 10, totalPages: 1 },
    };
  },

  async getProductById(id: string): Promise<ApiResponse<Product>> {
    await new Promise((r) => setTimeout(r, 400));
    const { MOCK_PRODUCTS } = await import("@/constants/mock-data");
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    return product
      ? { success: true, data: product }
      : { success: false, error: "Product not found" };
  },

  async createProduct(payload: CreateProductPayload): Promise<ApiResponse<Product>> {
    await new Promise((r) => setTimeout(r, 900));
    return { success: true, data: {} as Product, message: "Product created successfully" };
  },

  async updateProduct(id: string, payload: UpdateProductPayload): Promise<ApiResponse<Product>> {
    await new Promise((r) => setTimeout(r, 700));
    return { success: true, data: {} as Product, message: "Product updated successfully" };
  },

  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, message: "Product deleted successfully" };
  },

  async uploadProductImages(payload: UploadProductImagesPayload): Promise<ApiResponse<string[]>> {
    await new Promise((r) => setTimeout(r, 2000));
    const urls = payload.files.map((f) => URL.createObjectURL(f));
    return { success: true, data: urls, message: "Images uploaded successfully" };
  },

  async getCategories(): Promise<ApiResponse<Category[]>> {
    await new Promise((r) => setTimeout(r, 400));
    const { MOCK_CATEGORIES } = await import("@/constants/mock-data");
    return { success: true, data: MOCK_CATEGORIES };
  },

  async createCategory(payload: { name: string; description?: string }): Promise<ApiResponse<Category>> {
    await new Promise((r) => setTimeout(r, 600));
    return { success: true, data: {} as Category, message: "Category created successfully" };
  },

  async updateCategory(id: string, payload: { name?: string; isActive?: boolean }): Promise<ApiResponse<Category>> {
    await new Promise((r) => setTimeout(r, 500));
    return { success: true, data: {} as Category, message: "Category updated successfully" };
  },

  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    await new Promise((r) => setTimeout(r, 400));
    return { success: true, message: "Category deleted successfully" };
  },
};
