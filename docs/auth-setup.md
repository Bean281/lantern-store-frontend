# Authentication Setup Guide

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Backend API Configuration
# Replace with your actual backend API URL
BACKEND_URL=http://localhost:8000

# Examples:
# BACKEND_URL=https://your-backend-api.com
# BACKEND_URL=http://localhost:3001/api
```

## API Routes Created

The following API routes have been set up in your Next.js application:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (requires JWT)
- `GET /api/auth/me` - Get current user info (requires JWT)

## Files Created

### Types
- `types/auth.ts` - TypeScript interfaces for authentication DTOs

### API Routes
- `app/api/auth/register/route.ts` - Registration endpoint
- `app/api/auth/login/route.ts` - Login endpoint
- `app/api/auth/logout/route.ts` - Logout endpoint
- `app/api/auth/me/route.ts` - Get current user endpoint

### Utilities
- `lib/auth-api.ts` - Authentication API utility functions
- `hooks/use-auth.tsx` - Authentication hook and context provider

## Usage Examples

### 1. Wrap your app with AuthProvider

```tsx
// app/layout.tsx
import { AuthProvider } from '@/hooks/use-auth';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 2. Use authentication in components

```tsx
// components/LoginForm.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export default function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Redirect or handle success
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 3. Protect routes with authentication

```tsx
// components/ProtectedPage.tsx
import { withAuth } from '@/hooks/use-auth';

function ProtectedPage() {
  return (
    <div>
      <h1>This page requires authentication</h1>
    </div>
  );
}

export default withAuth(ProtectedPage, '/login');
```

### 4. Check authentication status

```tsx
// components/UserProfile.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';

export default function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h2>Welcome, {user.name || user.email}!</h2>
      <p>Email: {user.email}</p>
      <p>Admin: {user.isAdmin ? 'Yes' : 'No'}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Important Notes

1. **Backend Integration**: The API routes are set up to proxy requests to your backend. Make sure to set the `BACKEND_URL` environment variable.

2. **JWT Token Storage**: Tokens are stored in localStorage. Consider using httpOnly cookies for production applications for better security.

3. **Error Handling**: All API calls include proper error handling with TypeScript types.

4. **Token Expiration**: JWT tokens expire in 24 hours according to the API documentation.

5. **Security**: Passwords are never returned in API responses and are hashed using Argon2 on the backend.

## Next Steps

1. Set up your environment variables
2. Integrate with your actual backend API
3. Test the authentication flow
4. Customize the UI components as needed
5. Consider implementing refresh tokens for better user experience 