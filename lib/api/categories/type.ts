// Category Data Transfer Objects (DTOs)

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// API Response DTOs
export interface GetCategoriesResponseDto {
  categories: Category[];
}

export interface CreateCategoryDto {
  name: string;
}

export interface UpdateCategoryDto {
  name: string;
}

export interface CategoryResponseDto {
  success: boolean;
  category: Category;
}

export interface DeleteCategoryResponseDto {
  success: boolean;
  message: string;
}

// Error response structure
export interface CategoryErrorResponseDto {
  message: string;
  statusCode: number;
  error?: string;
} 