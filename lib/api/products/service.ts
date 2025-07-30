import {
  Product,
  GetProductsQuery,
  GetProductsResponseDto,
  ProductResponseDto,
  ProductStatsDto,
  CreateProductDto,
  UpdateProductDto,
  CreateProductResponseDto,
  UpdateProductResponseDto,
  DeleteProductResponseDto,
  ProductErrorResponse
} from './type';

const API_BASE_URL = 'https://lantern-store-backend.onrender.com/api/products';

// Generic error handler for API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const errorData: ProductErrorResponse = await response.json();
      // Create an error with status code for better handling
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      (error as any).status = response.status;
      throw error;
    } catch (parseError) {
      // If we can't parse the error response, throw a generic error
      const error = new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      (error as any).status = response.status;
      throw error;
    }
  }
  return response.json();
}

// Build query string from GetProductsQuery object
function buildQueryString(params: GetProductsQuery): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// Get all products with filtering, search, and pagination
export async function getProducts(query: GetProductsQuery = {}): Promise<GetProductsResponseDto> {
  try {
    const queryString = buildQueryString(query);
    const response = await fetch(`${API_BASE_URL}${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return handleApiResponse<GetProductsResponseDto>(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// Get all available product categories
export async function getProductCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return handleApiResponse<string[]>(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// Get product statistics for admin dashboard
export async function getProductStats(token: string): Promise<ProductStatsDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleApiResponse<ProductStatsDto>(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// Get single product by ID
export async function getProductById(id: string): Promise<ProductResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return handleApiResponse<ProductResponseDto>(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// Create FormData from CreateProductDto
function createProductFormData(productData: CreateProductDto): FormData {
  const formData = new FormData();
  
  // Add required fields
  formData.append('name', productData.name);
  formData.append('price', productData.price.toString());
  formData.append('category', productData.category);
  formData.append('description', productData.description);
  formData.append('features', productData.features);
  formData.append('specifications', productData.specifications);
  
  // Add optional fields
  if (productData.originalPrice !== undefined) {
    formData.append('originalPrice', productData.originalPrice.toString());
  }
  if (productData.inStock !== undefined) {
    formData.append('inStock', productData.inStock);
  }
  if (productData.stockCount !== undefined) {
    formData.append('stockCount', productData.stockCount);
  }
  
  // Add image files
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((image) => {
      formData.append('images', image);
    });
  }
  
  return formData;
}

// Create FormData from UpdateProductDto
function updateProductFormData(productData: UpdateProductDto): FormData {
  const formData = new FormData();
  
  // Add all provided fields
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined && key !== 'images') {
      if (key === 'price' || key === 'originalPrice') {
        formData.append(key, value.toString());
      } else {
        formData.append(key, value as string);
      }
    }
  });
  
  // Add image files
  if (productData.images && productData.images.length > 0) {
    productData.images.forEach((image) => {
      formData.append('images', image);
    });
  }
  
  return formData;
}

// Create new product with image upload (admin only)
export async function createProduct(token: string, productData: CreateProductDto): Promise<CreateProductResponseDto> {
  try {
    const formData = createProductFormData(productData);
    
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });

    return handleApiResponse<CreateProductResponseDto>(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// Update existing product with image management (admin only)
export async function updateProduct(token: string, id: string, productData: UpdateProductDto): Promise<UpdateProductResponseDto> {
  try {
    const formData = updateProductFormData(productData);
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData,
    });

    return handleApiResponse<UpdateProductResponseDto>(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// Delete product and its associated images (admin only)
export async function deleteProduct(token: string, id: string): Promise<DeleteProductResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleApiResponse<DeleteProductResponseDto>(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
} 