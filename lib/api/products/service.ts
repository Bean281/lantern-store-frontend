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
    let errorMessage = `HTTP error! status: ${response.status}`;
    let errorDetails = null;
    
    try {
      const errorData: ProductErrorResponse = await response.json();
      console.error('🚨 Full API Error Response:', errorData);
      errorMessage = errorData.message || errorMessage;
      errorDetails = errorData;
    } catch (parseError) {
      console.error('🚨 Could not parse error response as JSON');
      try {
        const responseText = await response.text();
        console.error('🚨 Raw error response text:', responseText);
        errorMessage = `${errorMessage} - ${responseText}`;
      } catch {
        console.error('🚨 Could not read error response text');
      }
    }
    
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    (error as any).details = errorDetails;
    throw error;
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
  
  console.log('🔧 FormData creation - Input data:', productData);
  
  // Add required fields
  formData.append('name', productData.name);
  formData.append('price', productData.price.toString());
  formData.append('category', productData.category);
  formData.append('description', productData.description);
  formData.append('features', String(productData.features));
  formData.append('specifications', String(productData.specifications));
  
  console.log('📦 Required fields added to FormData:');
  console.log('  name:', productData.name);
  console.log('  price:', productData.price.toString());
  console.log('  category:', productData.category);
  console.log('  description:', productData.description);
  console.log('  features:', String(productData.features), '(type:', typeof String(productData.features), ')');
  console.log('  specifications:', String(productData.specifications), '(type:', typeof String(productData.specifications), ')');
  
  // Add optional fields
  if (productData.originalPrice !== undefined) {
    formData.append('originalPrice', productData.originalPrice.toString());
    console.log('  originalPrice:', productData.originalPrice.toString());
  }
  if (productData.inStock !== undefined) {
    formData.append('inStock', productData.inStock);
    console.log('  inStock:', productData.inStock);
  }
  if (productData.stockCount !== undefined) {
    formData.append('stockCount', productData.stockCount);
    console.log('  stockCount:', productData.stockCount);
  }
  
  // Add image files
  if (productData.images && productData.images.length > 0) {
    console.log('📷 Adding images to FormData:');
    productData.images.forEach((image, index) => {
      console.log(`  Image ${index}:`, image.name, `(${image.size} bytes, ${image.type})`);
      formData.append('images', image);
    });
  } else {
    console.log('📷 No images to add');
  }
  
  // Log final FormData contents
  console.log('📋 Final FormData entries:');
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
    } else {
      console.log(`  ${key}: "${value}" (${typeof value})`);
    }
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