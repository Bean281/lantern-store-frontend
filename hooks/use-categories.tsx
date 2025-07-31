'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/lib/api/categories/type';
import {
  getCategories,
  getCategoriesWithDetails,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/lib/api/categories/service';
import { useAuth } from './use-auth';

// Query keys for React Query
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  details: () => [...categoryKeys.all, 'details'] as const,
};

// Hook for fetching all categories as string names (public)
export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async (): Promise<string[]> => {
      console.log('🚀 Fetching categories');
      const result = await getCategories();
      console.log('✅ Categories fetched successfully:', result);
      return result;
    },
    staleTime: 10 * 60 * 1000, // Categories change less frequently - 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
  });
}

// Hook for fetching all categories with full details (for admin operations)
export function useCategoriesWithDetailsQuery() {
  return useQuery({
    queryKey: categoryKeys.details(),
    queryFn: async (): Promise<Category[]> => {
      console.log('🚀 Fetching categories with details');
      const result = await getCategoriesWithDetails();
      console.log('✅ Categories with details fetched successfully:', result);
      return result;
    },
    staleTime: 10 * 60 * 1000, // Categories change less frequently - 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
  });
}

// Hook for creating a new category (admin only)
export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: async (categoryData: CreateCategoryDto): Promise<Category> => {
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log('🔨 Creating category:', categoryData);
      const result = await createCategory(categoryData, token);
      console.log('✅ Category created successfully:', result);
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch both categories queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.details() });
      console.log('📱 Categories cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Failed to create category:', error);
    },
  });
}

// Hook for updating an existing category (admin only)
export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: async ({
      categoryId,
      categoryData,
    }: {
      categoryId: string;
      categoryData: UpdateCategoryDto;
    }): Promise<Category> => {
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log('🔧 Updating category:', categoryId, categoryData);
      const result = await updateCategory(categoryId, categoryData, token);
      console.log('✅ Category updated successfully:', result);
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch both categories queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.details() });
      console.log('📱 Categories cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Failed to update category:', error);
    },
  });
}

// Hook for deleting a category (admin only)
export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  const { token } = useAuth();

  return useMutation({
    mutationFn: async (categoryId: string): Promise<void> => {
      if (!token) {
        throw new Error('Authentication required');
      }
      
      console.log('🗑️ Deleting category:', categoryId);
      await deleteCategory(categoryId, token);
      console.log('✅ Category deleted successfully');
    },
    onSuccess: () => {
      // Invalidate and refetch both categories queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.details() });
      console.log('📱 Categories cache invalidated');
    },
    onError: (error) => {
      console.error('❌ Failed to delete category:', error);
    },
  });
}

// Combined hook for all category operations
export function useCategories() {
  const categoriesQuery = useCategoriesWithDetailsQuery();
  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  return {
    // Query data
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error,
    isError: categoriesQuery.isError,
    
    // Refetch function
    refetch: categoriesQuery.refetch,
    
    // Mutations
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    
    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Mutation errors
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
} 