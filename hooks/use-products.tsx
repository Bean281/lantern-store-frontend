'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import {
  Product,
  GetProductsQuery,
  GetProductsResponseDto,
  ProductResponseDto,
  ProductStatsDto,
  CreateProductDto,
  UpdateProductDto,
  CreateProductResponseDto,
  UpdateProductResponseDto,
  DeleteProductResponseDto
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

// Products context interface
interface ProductsContextType {
  // State
  products: Product[];
  currentProduct: Product | null;
  categories: string[];
  stats: ProductStatsDto | null;
  isLoading: boolean;
  isLoadingProduct: boolean;
  isLoadingCategories: boolean;
  isLoadingStats: boolean;
  error: string | null;
  
  // Pagination & filtering
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  currentQuery: GetProductsQuery;
  
  // CRUD operations
  fetchProducts: (query?: GetProductsQuery) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchStats: () => Promise<void>;
  searchProducts: (searchTerm: string) => Promise<void>;
  filterByCategory: (category: string) => Promise<void>;
  sortProducts: (sortBy: string, sortOrder: 'asc' | 'desc') => Promise<void>;
  setPriceRange: (minPrice?: number, maxPrice?: number) => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  setPageSize: (limit: number) => Promise<void>;
  
  // Admin operations (require authentication)
  createNewProduct: (productData: CreateProductDto) => Promise<CreateProductResponseDto>;
  updateExistingProduct: (id: string, productData: UpdateProductDto) => Promise<UpdateProductResponseDto>;
  deleteExistingProduct: (id: string) => Promise<DeleteProductResponseDto>;
  
  // Utility functions
  clearError: () => void;
  clearCurrentProduct: () => void;
  refreshProducts: () => Promise<void>;
}

// Create the products context
const ProductsContext = createContext<ProductsContextType | null>(null);

// Products Provider Props
interface ProductsProviderProps {
  children: ReactNode;
}

// Products Provider Component
export function ProductsProvider({ children }: ProductsProviderProps) {
  // Basic state
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState<ProductStatsDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Pagination & filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentQuery, setCurrentQuery] = useState<GetProductsQuery>({
    page: 1,
    limit: 10
  });
  
  // Get auth context for admin operations
  const { token, user } = useAuth();
  
  // Fetch products with query
  const fetchProducts = async (query: GetProductsQuery = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const finalQuery = { ...currentQuery, ...query };
      setCurrentQuery(finalQuery);
      
      const response: GetProductsResponseDto = await getProducts(finalQuery);
      
      setProducts(response.products);
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
      setTotalProducts(response.total);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      setError(errorMessage);
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch single product by ID
  const fetchProductById = async (id: string) => {
    try {
      setIsLoadingProduct(true);
      setError(null);
      
      const product: ProductResponseDto = await getProductById(id);
      setCurrentProduct(product);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch product';
      setError(errorMessage);
      console.error('Failed to fetch product:', error);
    } finally {
      setIsLoadingProduct(false);
    }
  };
  
  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      setError(null);
      
      const categoriesData: string[] = await getProductCategories();
      setCategories(categoriesData);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
      setError(errorMessage);
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };
  
  // Fetch stats (admin only)
  const fetchStats = async () => {
    if (!token) {
      setError('Authentication required for stats');
      return;
    }
    
    try {
      setIsLoadingStats(true);
      setError(null);
      
      const statsData: ProductStatsDto = await getProductStats(token);
      setStats(statsData);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch stats';
      setError(errorMessage);
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };
  
  // Search products
  const searchProducts = async (searchTerm: string) => {
    await fetchProducts({ ...currentQuery, search: searchTerm, page: 1 });
  };
  
  // Filter by category
  const filterByCategory = async (category: string) => {
    await fetchProducts({ ...currentQuery, category, page: 1 });
  };
  
  // Sort products
  const sortProducts = async (sortBy: string, sortOrder: 'asc' | 'desc') => {
    await fetchProducts({ ...currentQuery, sortBy: sortBy as any, sortOrder, page: 1 });
  };
  
  // Set price range
  const setPriceRange = async (minPrice?: number, maxPrice?: number) => {
    await fetchProducts({ ...currentQuery, minPrice, maxPrice, page: 1 });
  };
  
  // Go to specific page
  const goToPage = async (page: number) => {
    await fetchProducts({ ...currentQuery, page });
  };
  
  // Set page size
  const setPageSize = async (limit: number) => {
    await fetchProducts({ ...currentQuery, limit, page: 1 });
  };
  
  // Create new product (admin only)
  const createNewProduct = async (productData: CreateProductDto): Promise<CreateProductResponseDto> => {
    if (!token) {
      throw new Error('Authentication required');
    }
    
    try {
      setError(null);
      const response = await createProduct(token, productData);
      
      // Refresh products list after creation
      await refreshProducts();
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
      setError(errorMessage);
      throw error;
    }
  };
  
  // Update existing product (admin only)
  const updateExistingProduct = async (id: string, productData: UpdateProductDto): Promise<UpdateProductResponseDto> => {
    if (!token) {
      throw new Error('Authentication required');
    }
    
    try {
      setError(null);
      const response = await updateProduct(token, id, productData);
      
      // Update current product if it's the one being updated
      if (currentProduct && currentProduct.id === id) {
        setCurrentProduct(response.product);
      }
      
      // Refresh products list after update
      await refreshProducts();
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
      setError(errorMessage);
      throw error;
    }
  };
  
  // Delete existing product (admin only)
  const deleteExistingProduct = async (id: string): Promise<DeleteProductResponseDto> => {
    if (!token) {
      throw new Error('Authentication required');
    }
    
    try {
      setError(null);
      const response = await deleteProduct(token, id);
      
      // Clear current product if it's the one being deleted
      if (currentProduct && currentProduct.id === id) {
        setCurrentProduct(null);
      }
      
      // Refresh products list after deletion
      await refreshProducts();
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
      setError(errorMessage);
      throw error;
    }
  };
  
  // Clear error state
  const clearError = () => {
    setError(null);
  };
  
  // Clear current product
  const clearCurrentProduct = () => {
    setCurrentProduct(null);
  };
  
  // Refresh products with current query
  const refreshProducts = async () => {
    await fetchProducts(currentQuery);
  };
  
  // Initialize products and categories on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  
  // Context value
  const contextValue: ProductsContextType = {
    // State
    products,
    currentProduct,
    categories,
    stats,
    isLoading,
    isLoadingProduct,
    isLoadingCategories,
    isLoadingStats,
    error,
    
    // Pagination & filtering
    currentPage,
    totalPages,
    totalProducts,
    currentQuery,
    
    // CRUD operations
    fetchProducts,
    fetchProductById,
    fetchCategories,
    fetchStats,
    searchProducts,
    filterByCategory,
    sortProducts,
    setPriceRange,
    goToPage,
    setPageSize,
    
    // Admin operations
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct,
    
    // Utility functions
    clearError,
    clearCurrentProduct,
    refreshProducts,
  };
  
  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

// Custom hook to use products context
export function useProducts(): ProductsContextType {
  const context = useContext(ProductsContext);
  
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  
  return context;
} 