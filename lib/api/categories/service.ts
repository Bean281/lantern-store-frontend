import {
  Category,
  GetCategoriesResponseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
  DeleteCategoryResponseDto,
  CategoryErrorResponseDto,
} from './type';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL 
  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`
  : 'https://lantern-store-backend.onrender.com/api/categories';

// Generic error handler for API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  console.log(`🌐 API Response: ${response.status} ${response.statusText} for ${response.url}`);
  
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const responseText = await response.text();
      console.error(`❌ Error response body:`, responseText);
      
      if (responseText) {
        try {
          const errorData: CategoryErrorResponseDto = JSON.parse(responseText);
          if (errorData.message) {
            const error = new Error(errorData.message) as Error & { status?: number };
            error.status = response.status;
            throw error;
          }
        } catch (parseError) {
          // If JSON parsing fails, use the raw text
          errorMessage = `${errorMessage} - ${responseText}`;
        }
      }
    } catch (error) {
      console.error(`❌ Failed to read error response:`, error);
    }
    
    const error = new Error(errorMessage) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  const responseText = await response.text();
  console.log(`✅ Success response body:`, responseText);
  
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error(`❌ Failed to parse JSON response:`, error);
    throw new Error(`Invalid JSON response: ${responseText}`);
  }
}

// Get all categories with full details (Public endpoint)
export async function getCategoriesWithDetails(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const data = await handleApiResponse<GetCategoriesResponseDto>(response);
    return data.categories;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// Get all categories as string names only (for backwards compatibility)
export async function getCategories(): Promise<string[]> {
  try {
    const categoriesWithDetails = await getCategoriesWithDetails();
    return categoriesWithDetails.map(category => category.name);
  } catch (error) {
    throw error;
  }
}

// Create new category (Admin only)
export async function createCategory(
  categoryData: CreateCategoryDto,
  token: string
): Promise<Category> {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    const data = await handleApiResponse<CategoryResponseDto>(response);
    return data.category;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// Update existing category (Admin only)
export async function updateCategory(
  categoryId: string,
  categoryData: UpdateCategoryDto,
  token: string
): Promise<Category> {
  console.log(`🔧 Updating category: ${categoryId}`, { categoryData, token: token ? '***' : 'missing' });
  
  try {
    const url = `${API_BASE_URL}/${categoryId}`;
    console.log(`🌐 PUT request to: ${url}`);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    const data = await handleApiResponse<CategoryResponseDto>(response);
    console.log(`✅ Update successful:`, data);
    return data.category;
  } catch (error) {
    console.error(`❌ Update failed:`, error);
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// Delete category (Admin only)
export async function deleteCategory(
  categoryId: string,
  token: string
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/${categoryId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    await handleApiResponse<DeleteCategoryResponseDto>(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
} 