// Product Data Transfer Objects (DTOs)

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// Query parameters for getting products
export interface GetProductsQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Response for getting multiple products
export interface GetProductsResponseDto {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

// Response for getting single product
export interface ProductResponseDto extends Product {}

// Product statistics for admin dashboard
export interface ProductStatsDto {
  totalProducts: number;
  inStockProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  averagePrice: number;
}

// Create product DTO (for form data)
export interface CreateProductDto {
  name: string;
  price: number;
  category: string;
  description: string;
  features: string; 
  specifications: string; 
  originalPrice?: number;
  inStock?: string; // "true" or "false"
  stockCount?: string; // Stock count as string
  images?: File[]; // Image files
}

// Update product DTO (for form data)
export interface UpdateProductDto {
  name?: string;
  price?: number;
  originalPrice?: number;
  category?: string;
  description?: string;
  features?: string; // JSON string of features array
  specifications?: string; // JSON string of specifications object
  inStock?: string; // "true" or "false"
  stockCount?: string; // Stock count as string
  existingImages?: string; // JSON array of existing image filenames to keep
  images?: File[]; // New image files to upload
}

// Response for creating product
export interface CreateProductResponseDto {
  success: boolean;
  product: Product;
  message: string;
}

// Response for updating product
export interface UpdateProductResponseDto {
  success: boolean;
  product: Product;
  message: string;
}

// Response for deleting product
export interface DeleteProductResponseDto {
  success: boolean;
  message: string;
}

// Error response interface
export interface ProductErrorResponse {
  success: false;
  message: string;
  statusCode: number;
} 