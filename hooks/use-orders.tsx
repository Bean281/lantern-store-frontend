'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import {
  Order,
  CreateOrderDto,
  UpdateOrderInfoDto,
  UpdateOrderStatusDto,
  OrderStatsDto,
} from '@/lib/api/orders/type';
import {
  createOrder,
  getOrdersByPhone,
  getAllOrders,
  getOrderStats,
  updateOrderStatus,
  updateOrderInfo,
  updateOrderInfoAdmin,
} from '@/lib/api/orders/service';
import { useAuth } from './use-auth';

// Query keys for React Query
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  byPhone: (phone: string) => [...orderKeys.all, 'byPhone', phone] as const,
  allOrders: () => [...orderKeys.all, 'allOrders'] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
};

// Hook for creating orders (Public)
export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: CreateOrderDto) => {
      console.log(' Creating order');
      const result = await createOrder(orderData);
      console.log(' Order created successfully:', result);
      return result;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
}

// Hook for fetching orders by phone number (Public)
export function useOrdersByPhone(phone: string | null) {
  return useQuery({
    queryKey: orderKeys.byPhone(phone || ''),
    queryFn: async () => {
      if (!phone) throw new Error('Phone number is required');
      console.log(' Fetching orders by phone:', phone);
      const result = await getOrdersByPhone(phone);
      console.log(' Orders fetched successfully:', result);
      return result;
    },
    enabled: !!phone, // Only run query if phone is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching all orders (Admin only)
export function useAllOrders() {
  const { user, token } = useAuth();
  
  return useQuery({
    queryKey: orderKeys.allOrders(),
    queryFn: async () => {
      if (!token) throw new Error('Authentication token required');
      console.log(' Fetching all orders (admin)');
      const result = await getAllOrders(token);
      console.log(' All orders fetched successfully:', result);
      return result;
    },
    enabled: !!user?.isAdmin && !!token, // Only run if user is admin and has token
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching order statistics (Admin only)
export function useOrderStats() {
  const { user, token } = useAuth();
  
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: async () => {
      if (!token) throw new Error('Authentication token required');
      console.log(' Fetching order statistics');
      const result = await getOrderStats(token);
      console.log(' Order statistics fetched successfully:', result);
      return result;
    },
    enabled: !!user?.isAdmin && !!token, // Only run if user is admin and has token
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for updating order status (Admin only)
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: UpdateOrderStatusDto['status'] }) => {
      if (!token) throw new Error('Authentication token required');
      console.log(' Updating order status:', orderId, status);
      const result = await updateOrderStatus(token, orderId, { status });
      console.log(' Order status updated successfully:', result);
      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: orderKeys.allOrders() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
    },
  });
}

// Hook for updating order information (Public with phone verification)
export function useUpdateOrderInfo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      orderId, 
      phone, 
      updateData 
    }: { 
      orderId: string; 
      phone: string; 
      updateData: UpdateOrderInfoDto 
    }) => {
      console.log(' Updating order info:', orderId, updateData);
      const result = await updateOrderInfo(orderId, phone, updateData);
      console.log(' Order info updated successfully:', result);
      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: orderKeys.byPhone(variables.phone) });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
    },
  });
}

// Hook for updating order information (Admin only)
export function useUpdateOrderInfoAdmin() {
  const queryClient = useQueryClient();
  const { token } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      orderId, 
      updateData 
    }: { 
      orderId: string; 
      updateData: UpdateOrderInfoDto 
    }) => {
      if (!token) throw new Error('Authentication token required');
      console.log(' Updating order info (admin):', orderId, updateData);
      const result = await updateOrderInfoAdmin(token, orderId, updateData);
      console.log(' Order info updated successfully (admin):', result);
      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: orderKeys.allOrders() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
    },
  });
}

// Wrapper hook that provides a unified interface for order management
export function useOrders() {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // Queries
  const ordersByPhoneQuery = useOrdersByPhone(phoneNumber || null);
  const allOrdersQuery = useAllOrders();
  const orderStatsQuery = useOrderStats();

  // Mutations
  const createOrderMutation = useCreateOrder();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const updateOrderInfoMutation = useUpdateOrderInfo();
  const updateOrderInfoAdminMutation = useUpdateOrderInfoAdmin();

  // Helper functions
  const searchOrdersByPhone = useCallback((phone: string) => {
    setPhoneNumber(phone);
  }, []);

  const clearSearch = useCallback(() => {
    setPhoneNumber('');
  }, []);

  return {
    // Phone-based order search
    phoneNumber,
    searchOrdersByPhone,
    clearSearch,
    ordersByPhone: ordersByPhoneQuery.data?.orders || [],
    isLoadingOrdersByPhone: ordersByPhoneQuery.isLoading,
    ordersByPhoneError: ordersByPhoneQuery.error?.message || null,

    // Admin queries
    allOrders: allOrdersQuery.data || [],
    isLoadingAllOrders: allOrdersQuery.isLoading,
    allOrdersError: allOrdersQuery.error?.message || null,

    // Order statistics
    orderStats: orderStatsQuery.data || null,
    isLoadingStats: orderStatsQuery.isLoading,
    statsError: orderStatsQuery.error?.message || null,

    // Mutations
    createOrder: createOrderMutation.mutateAsync,
    updateOrderStatus: updateOrderStatusMutation.mutateAsync,
    updateOrderInfo: updateOrderInfoMutation.mutateAsync,
    updateOrderInfoAdmin: updateOrderInfoAdminMutation.mutateAsync,

    // Mutation states
    isCreatingOrder: createOrderMutation.isPending,
    isUpdatingStatus: updateOrderStatusMutation.isPending,
    isUpdatingInfo: updateOrderInfoMutation.isPending,
    isUpdatingInfoAdmin: updateOrderInfoAdminMutation.isPending,

    // Force refresh functions
    refreshOrdersByPhone: () => ordersByPhoneQuery.refetch(),
    refreshAllOrders: () => allOrdersQuery.refetch(),
    refreshStats: () => orderStatsQuery.refetch(),
  };
}
