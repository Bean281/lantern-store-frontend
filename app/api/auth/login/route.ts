import { NextRequest, NextResponse } from 'next/server';
import { AuthDto, AuthResponseDto, AuthErrorResponse } from '@/lib/api/auth/type';

export async function POST(request: NextRequest) {
  try {
    const body: AuthDto = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
          statusCode: 400
        } as AuthErrorResponse,
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email format',
          statusCode: 400
        } as AuthErrorResponse,
        { status: 400 }
      );
    }

    // TODO: Replace with actual backend API call
    // This is a placeholder implementation
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      if (backendResponse.status === 403) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid email or password',
            statusCode: 403
          } as AuthErrorResponse,
          { status: 403 }
        );
      }
      
      throw new Error(`Backend responded with status: ${backendResponse.status}`);
    }

    const data: AuthResponseDto = await backendResponse.json();
    
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
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