import { NextRequest, NextResponse } from 'next/server';
import { MeResponseDto, AuthErrorResponse } from '@/lib/api/auth/type';

export async function GET(request: NextRequest) {
  try {
    // Extract JWT token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authorization token required',
          statusCode: 401
        } as AuthErrorResponse,
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid authorization token',
          statusCode: 401
        } as AuthErrorResponse,
        { status: 401 }
      );
    }

    // TODO: Replace with actual backend API call
    // This is a placeholder implementation
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 401) {
        return NextResponse.json(
          {
            success: false,
            message: 'Unauthorized - invalid or expired token',
            statusCode: 401
          } as AuthErrorResponse,
          { status: 401 }
        );
      }
      
      throw new Error(`Backend responded with status: ${backendResponse.status}`);
    }

    const data: MeResponseDto = await backendResponse.json();
    
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Get user info error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        statusCode: 500
      } as AuthErrorResponse,
      { status: 500 }
    );
  }
} 