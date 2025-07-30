'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import {
  Product,
  GetProductsQuery,
  GetProductsResponseDto,
  ProductStatsDto,
  CreateProductDto,
  UpdateProductDto,
} from '@/lib/api/products/type';
import {
  getProducts,
  getProductCategories,
  getProductStats,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '@/lib/api/products/service';
import { useAuth } from './use-auth';

// Query keys for React Query
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: GetProductsQuery) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  categories: () => ['categories'] as const,
  stats: () => ['product-stats'] as const,
};

// Hook for fetching products with filters
export function useProductsQuery(query: GetProductsQuery = {}) {
  console.log('🔍 useProductsQuery called with:', query);
  
  return useQuery({
    queryKey: productKeys.list(query),
    queryFn: async (): Promise<GetProductsResponseDto> => {
      console.log('🚀 Fetching products with query:', query);
      const result = await getProducts(query);
      console.log('✅ Products fetched successfully:', result);
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching a single product by ID
export function useProductByIdQuery(id: string | null) {
  return useQuery({
    queryKey: productKeys.detail(id || ''),
    queryFn: async (): Promise<Product> => {
      if (!id) throw new Error('Product ID is required');
      console.log('🚀 Fetching product by ID:', id);
      const result = await getProductById(id);
      console.log('✅ Product fetched successfully:', result);
      return result;
    },
    enabled: !!id, // Only run query if ID is provided
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook for fetching categories
export function useCategoriesQuery() {
  return useQuery({
    queryKey: productKeys.categories(),
    queryFn: async (): Promise<string[]> => {
      console.log('🚀 Fetching categories');
      const result = await getProductCategories();
      console.log('✅ Categories fetched successfully:', result);
      return result;
    },
    staleTime: 10 * 60 * 1000, // Categories change less frequently
    gcTime: 15 * 60 * 1000,
  });
}

// Hook for fetching product stats (admin only)
export function useProductStatsQuery() {
  const { user, token } = useAuth();
  
  return useQuery({
    queryKey: productKeys.stats(),
    queryFn: async (): Promise<ProductStatsDto> => {
      if (!token) throw new Error('Authentication token required');
      console.log('🚀 Fetching product stats');
      const result = await getProductStats(token);
      console.log('✅ Product stats fetched successfully:', result);
      return result;
    },
    enabled: !!user?.isAdmin && !!token, // Only run if user is admin and has token
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook for creating products (admin only)
export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async (data: CreateProductDto) => {
      if (!token) throw new Error('Authentication token required');
      console.log('🚀 Creating product');
      const result = await createProduct(token, data);
      console.log('✅ Product created successfully:', result);
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch products and categories
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.categories() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
    },
  });
}

// Hook for updating products (admin only)
export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProductDto }) => {
      if (!token) throw new Error('Authentication token required');
      console.log('🚀 Updating product:', id);
      const result = await updateProduct(token, id, data);
      console.log('✅ Product updated successfully:', result);
      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.categories() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
    },
  });
}

// Hook for deleting products (admin only)
export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      if (!token) throw new Error('Authentication token required');
      console.log('🚀 Deleting product:', id);
      const result = await deleteProduct(token, id);
      console.log('✅ Product deleted successfully:', result);
      return result;
    },
    onSuccess: (data, variables) => {
      // Remove from cache and invalidate lists
      queryClient.removeQueries({ queryKey: productKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
    },
  });
}

// Wrapper hook that provides the same interface as the old useProducts hook
export function useProducts() {
  const [currentQuery, setCurrentQuery] = useState<GetProductsQuery>({
    page: 1,
    limit: 10,
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Main queries
  const productsQuery = useProductsQuery(currentQuery);
  const categoriesQuery = useCategoriesQuery();
  const productQuery = useProductByIdQuery(selectedProductId);
  const statsQuery = useProductStatsQuery();

  // Mutations
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  // Helper functions to maintain the same interface
  const fetchProducts = useCallback(async (query?: GetProductsQuery) => {
    const newQuery = { ...currentQuery, ...query };
    setCurrentQuery(newQuery);
  }, [currentQuery]);

  const fetchProductById = useCallback(async (id: string) => {
    setSelectedProductId(id);
  }, []);

  const searchProducts = useCallback(async (search: string) => {
    setCurrentQuery(prev => ({ ...prev, search, page: 1 }));
  }, []);

  const filterByCategory = useCallback(async (category: string) => {
    setCurrentQuery(prev => ({ ...prev, category, page: 1 }));
  }, []);

  const sortProducts = useCallback(async (sortBy: 'name' | 'price' | 'rating' | 'createdAt', sortOrder: 'asc' | 'desc' = 'asc') => {
    setCurrentQuery(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
  }, []);

  const setPriceRange = useCallback(async (minPrice?: number, maxPrice?: number) => {
    setCurrentQuery(prev => ({ ...prev, minPrice, maxPrice, page: 1 }));
  }, []);

  const goToPage = useCallback(async (page: number) => {
    setCurrentQuery(prev => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback(async (limit: number) => {
    setCurrentQuery(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  const clearCurrentProduct = useCallback(() => {
    setSelectedProductId(null);
  }, []);

  const forceRefresh = useCallback(() => {
    // Force refetch all queries
    productsQuery.refetch();
    categoriesQuery.refetch();
    if (selectedProductId) {
      productQuery.refetch();
    }
  }, [productsQuery, categoriesQuery, productQuery, selectedProductId]);

  return {
    // State
    products: productsQuery.data?.products || [],
    currentProduct: productQuery.data || null,
    categories: categoriesQuery.data || [],
    stats: statsQuery.data || null,
    
    // Loading states
    isLoading: productsQuery.isLoading,
    isLoadingProduct: productQuery.isLoading,
    isLoadingCategories: categoriesQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    
    // Error states
    error: productsQuery.error?.message || 
           productQuery.error?.message || 
           categoriesQuery.error?.message || 
           statsQuery.error?.message || 
           null,
    
    // Pagination & filtering
    currentPage: currentQuery.page || 1,
    totalPages: productsQuery.data?.totalPages || 0,
    totalProducts: productsQuery.data?.total || 0,
    currentQuery,
    
    // Functions
    fetchProducts,
    fetchProductById,
    fetchCategories: () => categoriesQuery.refetch(),
    fetchStats: () => statsQuery.refetch(),
    searchProducts,
    filterByCategory,
    sortProducts,
    setPriceRange,
    goToPage,
    setPageSize,
    clearError: () => {}, // React Query handles errors differently
    clearCurrentProduct,
    forceRefresh,
    
    // CRUD operations
    createNewProduct: createMutation.mutateAsync,
    updateExistingProduct: updateMutation.mutateAsync,
    deleteExistingProduct: deleteMutation.mutateAsync,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
} 