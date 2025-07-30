import {
  Order,
  CreateOrderDto,
  CreateOrderResponseDto,
  GetOrdersByPhoneResponseDto,
  UpdateOrderInfoDto,
  UpdateOrderInfoResponseDto,
  UpdateOrderStatusDto,
  OrderStatsDto,
  OrderErrorResponse,
} from './type';

// Base URL for order API
const API_BASE_URL = 'https://lantern-store-backend.onrender.com/api/orders';

// Generic API response handler
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(`HTTP error! status: ${response.status}`) as Error & { status?: number };
    error.status = response.status;
    console.error(' API Error:', error);
    throw error;
  }
  return response.json();
}

// 1. Create new order (Public endpoint)
export async function createOrder(orderData: CreateOrderDto): Promise<CreateOrderResponseDto> {
  try {
    console.log(' Creating order:', orderData);
    
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await handleApiResponse<CreateOrderResponseDto>(response);
    console.log(' Order created successfully:', result);
    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// 2. Get orders by phone number (Public endpoint)
export async function getOrdersByPhone(phone: string): Promise<GetOrdersByPhoneResponseDto> {
  try {
    console.log(' Fetching orders by phone:', phone);
    
    const response = await fetch(`${API_BASE_URL}?phone=${encodeURIComponent(phone)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const result = await handleApiResponse<GetOrdersByPhoneResponseDto>(response);
    console.log(' Orders fetched successfully:', result);
    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// 3. Get all orders (Admin only)
export async function getAllOrders(token: string): Promise<Order[]> {
  try {
    console.log(' Fetching all orders (admin)');
    
    const response = await fetch(`${API_BASE_URL}/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await handleApiResponse<Order[]>(response);
    console.log(' All orders fetched successfully:', result);
    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// 4. Get order statistics (Admin only)
export async function getOrderStats(token: string): Promise<OrderStatsDto> {
  try {
    console.log(' Fetching order statistics');
    
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await handleApiResponse<OrderStatsDto>(response);
    console.log(' Order statistics fetched successfully:', result);
    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// 5. Update order status (Admin only)
export async function updateOrderStatus(
  token: string,
  orderId: string,
  statusData: UpdateOrderStatusDto
): Promise<Order> {
  try {
    console.log(' Updating order status:', orderId, statusData);
    
    const response = await fetch(`${API_BASE_URL}/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(statusData),
    });

    const result = await handleApiResponse<Order>(response);
    console.log(' Order status updated successfully:', result);
    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// 6. Update order information (Public with phone verification)
export async function updateOrderInfo(
  orderId: string,
  phone: string,
  updateData: UpdateOrderInfoDto
): Promise<UpdateOrderInfoResponseDto> {
  try {
    console.log(' Updating order info:', orderId, updateData);
    
    const response = await fetch(`${API_BASE_URL}/${orderId}?phone=${encodeURIComponent(phone)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const result = await handleApiResponse<UpdateOrderInfoResponseDto>(response);
    console.log(' Order info updated successfully:', result);
    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// 7. Update order information (Admin only - no phone verification)
export async function updateOrderInfoAdmin(
  token: string,
  orderId: string,
  updateData: UpdateOrderInfoDto
): Promise<UpdateOrderInfoResponseDto> {
  try {
    console.log(' Updating order info (admin):', orderId, updateData);
    
    const response = await fetch(`${API_BASE_URL}/${orderId}/admin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const result = await handleApiResponse<UpdateOrderInfoResponseDto>(response);
    console.log(' Order info updated successfully (admin):', result);
    return result;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

