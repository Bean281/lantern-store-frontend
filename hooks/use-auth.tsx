'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  User, 
  RegisterDto, 
  AuthDto, 
  AuthResponseDto 
} from '@/lib/api/auth/type';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser, 
  TokenManager 
} from '@/lib/api/auth/service';

// Authentication context interface
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: AuthDto) => Promise<AuthResponseDto>;
  register: (userData: RegisterDto) => Promise<AuthResponseDto>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  clearAuthState: () => void;
  error: string | null;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Authentication Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = Boolean(user && token);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Initialize authentication state
  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const storedToken = TokenManager.getToken();
      
      if (storedToken) {
        // Don't set token in state until we verify it's valid
        await fetchCurrentUser(storedToken);
        // Only set token if fetchCurrentUser succeeds
        setToken(storedToken);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Clear all auth state on any initialization error
      setUser(null);
      setToken(null);
      TokenManager.removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch current user information
  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await getCurrentUser(authToken);
      setUser(response.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      
      // If it's a 401 error, silently clear the invalid token without throwing
      if ((error as any)?.status === 401) {
        console.log('Invalid token detected, clearing auth state');
        setUser(null);
        setToken(null);
        TokenManager.removeToken();
        return; // Don't throw for 401 errors during initialization
      }
      
      // Clear invalid session for other errors and throw
      setUser(null);
      setToken(null);
      TokenManager.removeToken();
      throw error;
    }
  };

  // Login function
  const login = async (credentials: AuthDto): Promise<AuthResponseDto> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await loginUser(credentials);
      
      setUser(response.user);
      setToken(response.token);
      TokenManager.setToken(response.token);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: RegisterDto): Promise<AuthResponseDto> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await registerUser(userData);
      
      setUser(response.user);
      setToken(response.token);
      TokenManager.setToken(response.token);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      if (token) {
        await logoutUser(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server logout fails
    } finally {
      // Clear local state regardless of server response
      setUser(null);
      setToken(null);
      TokenManager.removeToken();
      setIsLoading(false);
    }
  };

  // Refresh current user data
  const refreshUser = async (): Promise<void> => {
    if (!token) {
      throw new Error('No authentication token available');
    }
    
    try {
      setIsLoading(true);
      await fetchCurrentUser(token);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  // Clear all auth state (useful for debugging or forced logout)
  const clearAuthState = () => {
    setUser(null);
    setToken(null);
    setError(null);
    TokenManager.removeToken();
  };

  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    clearError,
    clearAuthState,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use authentication context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo: string = '/login'
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        window.location.href = redirectTo;
      }
    }, [isAuthenticated, isLoading]);
    
    if (isLoading) {
      return <div>Loading...</div>;
    }
    
    if (!isAuthenticated) {
      return null;
    }
    
    return <Component {...props} />;
  };
} 