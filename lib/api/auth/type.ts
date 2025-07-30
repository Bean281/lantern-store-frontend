// Authentication Data Transfer Objects (DTOs)

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface AuthDto {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string | object | null;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseDto {
  success: boolean;
  user: User;
  token: string;
}

export interface LogoutResponseDto {
  success: boolean;
}

export interface MeResponseDto {
  user: User;
}

// Error response interface
export interface AuthErrorResponse {
  success: false;
  message: string;
  statusCode: number;
} 