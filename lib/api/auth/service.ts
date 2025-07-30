import { 
  RegisterDto, 
  AuthDto, 
  AuthResponseDto, 
  LogoutResponseDto, 
  MeResponseDto,
  AuthErrorResponse 
} from './type';

const API_BASE_URL = 'https://lantern-store-backend.onrender.com/api/auth';

// Generic error handler for API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const errorData: AuthErrorResponse = await response.json();
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

// Register a new user
export async function registerUser(userData: RegisterDto): Promise<AuthResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return handleApiResponse<AuthResponseDto>(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// Login user
export async function loginUser(credentials: AuthDto): Promise<AuthResponseDto> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    return handleApiResponse<AuthResponseDto>(response);
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    }
    throw error;
  }
}

// Logout user
export async function logoutUser(token: string): Promise<LogoutResponseDto> {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleApiResponse<LogoutResponseDto>(response);
}

// Get current user information
export async function getCurrentUser(token: string): Promise<MeResponseDto> {
  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleApiResponse<MeResponseDto>(response);
}

// Token management utilities
export const TokenManager = {
  // Store token in localStorage
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  // Remove token from localStorage
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  // Check if token exists
  hasToken: (): boolean => {
    return Boolean(TokenManager.getToken());
  }
}; 