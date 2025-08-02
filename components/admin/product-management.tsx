"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, MoreHorizontal, Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/components/language/language-context"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { formatVND } from "@/lib/utils"
import { 
  useProductsQuery, 
  useCategoriesQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation 
} from "@/hooks/use-products-query"
import type { Product, CreateProductDto, UpdateProductDto } from "@/lib/api/products/type"

export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    description: "",
    inStock: true,
    stockCount: "",
    // features: [] as string[],
    // specifications: {} as Record<string, string>,
  })
  const [productImages, setProductImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null)

  const { t } = useLanguage()
  const { toast } = useToast()
  const { user } = useAuth()

  // React Query hooks
  const { data: productsData, isLoading: isLoadingProducts, error: productsError, refetch } = useProductsQuery({ limit: 100 })
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery()
  const createProductMutation = useCreateProductMutation()
  const updateProductMutation = useUpdateProductMutation()
  const deleteProductMutation = useDeleteProductMutation()

  const products = productsData?.products || []

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getCategoryTranslation = (category: string) => {
    // Simple category translation mapping
    const categoryMap: Record<string, string> = {
      'LED': t("led") || "LED",
      'Oil': t("oil") || "Oil", 
      'Solar': t("solar") || "Solar",
      'Decorative': t("decorative") || "Decorative",
      'Emergency': t("emergency") || "Emergency"
    }
    return categoryMap[category] || category
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: "",
      price: "",
      originalPrice: "",
      category: "",
      description: "",
      inStock: true,
      stockCount: "",
      // features: [],
      // specifications: {},
    })
    setProductImages([])
    setExistingImages([])
    setShowProductModal(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    
    // Safely parse features and specifications from JSON strings or use existing arrays/objects
    let parsedFeatures: string[] = []
    let parsedSpecifications: Record<string, string> = {}
    
    try {
      if (Array.isArray(product.features)) {
        parsedFeatures = product.features
      } else if (typeof product.features === 'string' && product.features) {
        parsedFeatures = JSON.parse(product.features)
      }
    } catch (error) {
      console.warn('Failed to parse product features:', error)
      parsedFeatures = []
    }
    
    try {
      if (typeof product.specifications === 'object' && product.specifications && !Array.isArray(product.specifications)) {
        parsedSpecifications = product.specifications
      } else if (typeof product.specifications === 'string' && product.specifications) {
        parsedSpecifications = JSON.parse(product.specifications)
      }
    } catch (error) {
      console.warn('Failed to parse product specifications:', error)
      parsedSpecifications = {}
    }
    
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      category: product.category,
      description: product.description,
      inStock: product.inStock,
      stockCount: product.stockCount.toString(),
      // features: parsedFeatures,
      // specifications: parsedSpecifications,
    })
    setProductImages([]) // Clear file inputs for editing
    setExistingImages(product.images || []) // Set existing images from the product
    setShowProductModal(true)
  }

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.category || !productForm.description) {
      toast({
        title: t("error"),
        description: "Please fill in all required fields (name, price, category, description)",
        variant: "destructive",
      })
      return
    }

    if (!editingProduct && productImages.length === 0) {
      toast({
        title: t("error"),
        description: "Please add at least one product image",
        variant: "destructive",
      })
      return
    }

    if (editingProduct && existingImages.length === 0 && productImages.length === 0) {
      toast({
        title: t("error"),
        description: "Please keep or add at least one product image",
        variant: "destructive",
      })
      return
    }

    // Validate features and specifications can be converted to JSON
    // if (!validateFeaturesAndSpecs()) {
    //   return
    // }

    try {
      if (editingProduct) {
        // Update existing product
        // Debug: Log the existingImages before conversion
        console.log('🔍 existingImages before conversion:', existingImages, 'Type:', typeof existingImages)
        
        const existingImagesString = safeJsonStringify(existingImages, "[]")
        console.log('🔍 existingImages after conversion:', existingImagesString, 'Type:', typeof existingImagesString)
        
        // Extra validation: Ensure it's a proper JSON string
        if (typeof existingImagesString !== 'string') {
          console.error('❌ existingImagesString is not a string!', existingImagesString)
          throw new Error('Failed to convert existingImages to string')
        }
        
        // Test if it's valid JSON
        try {
          const parsed = JSON.parse(existingImagesString)
          console.log('✅ existingImagesString is valid JSON:', parsed)
        } catch (error) {
          console.error('❌ existingImagesString is not valid JSON:', error)
          throw new Error('existingImagesString is not valid JSON')
        }

        // Alternative approach: Force explicit string conversion
        const forceStringConversion = Array.isArray(existingImages) 
          ? JSON.stringify(existingImages) 
          : String(existingImages)
        
        console.log('🔄 Force string conversion result:', forceStringConversion, 'Type:', typeof forceStringConversion)

        const updateData: UpdateProductDto = {
          name: productForm.name,
          price: Number.parseFloat(productForm.price),
          originalPrice: productForm.originalPrice ? Number.parseFloat(productForm.originalPrice) : undefined,
          category: productForm.category,
          description: productForm.description,
          inStock: productForm.inStock ? "true" : "false",
          stockCount: productForm.stockCount || "0",
          // features: safeJsonStringify(productForm.features, "[]"), // Safe JSON string conversion
          // specifications: safeJsonStringify(productForm.specifications, "{}"), // Safe JSON string conversion
          existingImages: forceStringConversion, // Use the force-converted string
        }

        // Debug: Log the final updateData
        console.log('🔍 Final updateData:', updateData)

        if (productImages.length > 0) {
          updateData.images = productImages // Send new images to upload
        }

        await updateProductMutation.mutateAsync({ id: editingProduct.id, data: updateData })
        
        toast({
          title: t("success"),
          description: "Product updated successfully",
        })
      } else {
        // Create new product
        const createData: CreateProductDto = {
          name: productForm.name,
          price: Number.parseFloat(productForm.price),
          originalPrice: productForm.originalPrice ? Number.parseFloat(productForm.originalPrice) : undefined,
          category: productForm.category,
          description: productForm.description,
          inStock: productForm.inStock ? "true" : "false",
          stockCount: productForm.stockCount || "0",
          features: "", // Empty JSON array string for now
          specifications: "", // Empty JSON object string for now
          images: productImages,
        }

        await createProductMutation.mutateAsync(createData)
        
        toast({
          title: t("success"),
          description: "Product added successfully",
        })
      }

      setShowProductModal(false)
      setProductForm({
        name: "",
        price: "",
        originalPrice: "",
        category: "",
        description: "",
        inStock: true,
        stockCount: "",
        // features: [],
        // specifications: {},
      })
      setProductImages([])
      setExistingImages([])
      refetch() // Refresh the products list
    } catch (error) {
      console.error('Failed to save product:', error)
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductMutation.mutateAsync(productId)
      toast({
        title: t("success"),
        description: "Product deleted successfully",
      })
      refetch() // Refresh the products list
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setProductImages((prev) => [...prev, ...Array.from(files)])
    }
  }

  const handleRemoveImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Features management
  // const addFeature = () => {
  //   setProductForm(prev => ({
  //     ...prev,
  //     features: [...prev.features, ""]
  //   }))
  // }

  // const updateFeature = (index: number, value: string) => {
  //   setProductForm(prev => ({
  //     ...prev,
  //     features: prev.features.map((feature, i) => i === index ? value : feature)
  //   }))
  // }

  // const removeFeature = (index: number) => {
  //   setProductForm(prev => ({
  //     ...prev,
  //     features: prev.features.filter((_, i) => i !== index)
  //   }))
  // }

  // Specifications management
  // const addSpecification = () => {
  //   setProductForm(prev => ({
  //     ...prev,
  //     specifications: { ...prev.specifications, "": "" }
  //   }))
  // }

  // const updateSpecificationKey = (oldKey: string, newKey: string) => {
  //   setProductForm(prev => {
  //     const newSpecs = { ...prev.specifications }
  //     if (oldKey !== newKey) {
  //       newSpecs[newKey] = newSpecs[oldKey]
  //       delete newSpecs[oldKey]
  //     }
  //     return { ...prev, specifications: newSpecs }
  //   })
  // }

  // const updateSpecificationValue = (key: string, value: string) => {
  //   setProductForm(prev => ({
  //     ...prev,
  //     specifications: { ...prev.specifications, [key]: value }
  //   }))
  // }

  // const removeSpecification = (key: string) => {
  //   setProductForm(prev => {
  //     const newSpecs = { ...prev.specifications }
  //     delete newSpecs[key]
  //     return { ...prev, specifications: newSpecs }
  //   })
  // }

  // Helper function to safely convert arrays/objects to JSON strings
  const safeJsonStringify = (data: any, fallback: string = '[]'): string => {
    try {
      // If it's already a string, check if it's valid JSON, if so return it, otherwise parse and re-stringify
      if (typeof data === 'string') {
        try {
          JSON.parse(data) // Test if it's valid JSON
          return data // It's already a valid JSON string
        } catch {
          // It's a string but not JSON, so wrap it in an array
          return JSON.stringify([data])
        }
      }
      
      // If it's an array or object, stringify it
      const result = JSON.stringify(data)
      console.log('🔧 safeJsonStringify result:', result, 'Type:', typeof result)
      return result
    } catch (error) {
      console.warn('Failed to stringify data:', error, 'Data:', data)
      return fallback
    }
  }

  // Validation function for features and specifications
  // const validateFeaturesAndSpecs = () => {
  //   try {
  //     // Test if features can be converted to valid JSON
  //     JSON.stringify(productForm.features)
  //     // Test if specifications can be converted to valid JSON
  //     JSON.stringify(productForm.specifications)
  //     return true
  //   } catch (error) {
  //     toast({
  //       title: t("error"),
  //       description: "Invalid features or specifications data. Please check your entries.",
  //       variant: "destructive",
  //     })
  //     return false
  //   }
  // }

  // Demo function to populate form with sample data (for testing purposes)
  const populateWithSampleData = () => {
    setProductForm({
      name: "Lồng đèn Bướm Bướm Cỡ Trung - Phiên bản Premium",
      price: "45000",
      originalPrice: "55000",
      category: "Lồng đèn truyền thống",
      description: "Lồng đèn bướm cỡ trung cao cấp với thiết kế tinh xảo. Kích thước từ 32-40cm, khung tre tự nhiên chắc chắn, giấy phủ chống thấm cao cấp.",
      inStock: true,
      stockCount: "750",
      // features: [
      //   "Khung tre tự nhiên 100%",
      //   "Giấy silk chống thấm cao cấp", 
      //   "Thiết kế bướm 3D tinh xảo",
      //   "Màu sắc bền đẹp không phai",
      //   "Dễ dàng lắp đặt trong 2 phút",
      //   "Kháng gió nhẹ và ẩm ướt",
      //   "Tương thích với đèn LED",
      //   "Có thể gập gọn để bảo quản",
      //   "An toàn cho trẻ em",
      //   "Thân thiện với môi trường"
      // ],
      // specifications: {
      //   "Kích thước": "Dài 32-40cm, Rộng 25-30cm",
      //   "Chất liệu khung": "Tre tự nhiên cao cấp",
      //   "Chất liệu vỏ": "Giấy silk chống thấm",
      //   "Trọng lượng": "200-300g",
      //   "Màu sắc": "Đỏ, vàng, xanh lá, xanh dương",
      //   "Độ bền": "2-3 năm sử dụng",
      //   "Kháng nước": "IPX3 - chống mưa phùn",
      //   "Nhiệt độ sử dụng": "5°C đến 40°C",
      //   "Bảo hành": "6 tháng",
      //   "Xuất xứ": "Thủ công Việt Nam",
      //   "Chứng nhận": "An toàn thực phẩm",
      //   "Kiểu dáng": "Bướm truyền thống Á Đông"
      // }
    })
  }

  // Get combined images for display
  const getAllImages = () => {
    return [...existingImages, ...productImages]
  }

  const handleDragStart = (index: number) => {
    setDraggedImageIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedImageIndex === null) return

    const allImages = getAllImages()
    const existingImagesCount = existingImages.length
    
    // Determine which array the dragged item belongs to
    const isDraggedFromExisting = draggedImageIndex < existingImagesCount
    const isDropToExisting = dropIndex < existingImagesCount

    if (isDraggedFromExisting && isDropToExisting) {
      // Both in existing images
      const newExistingImages = [...existingImages]
      const draggedImage = newExistingImages[draggedImageIndex]
      newExistingImages.splice(draggedImageIndex, 1)
      newExistingImages.splice(dropIndex, 0, draggedImage)
      setExistingImages(newExistingImages)
    } else if (!isDraggedFromExisting && !isDropToExisting) {
      // Both in new images
      const draggedNewIndex = draggedImageIndex - existingImagesCount
      const dropNewIndex = dropIndex - existingImagesCount
      const newProductImages = [...productImages]
      const draggedImage = newProductImages[draggedNewIndex]
      newProductImages.splice(draggedNewIndex, 1)
      newProductImages.splice(dropNewIndex, 0, draggedImage)
      setProductImages(newProductImages)
    } else {
      // Cannot move between existing and new images due to type differences
      // Just reorder within the same type
      return
    }

    setDraggedImageIndex(null)
  }

  const setMainImage = (index: number) => {
    const existingImagesCount = existingImages.length
    
    if (index < existingImagesCount) {
      // Move existing image to front of existing images
      const newExistingImages = [...existingImages]
      const mainImage = newExistingImages[index]
      newExistingImages.splice(index, 1)
      newExistingImages.unshift(mainImage)
      setExistingImages(newExistingImages)
    } else {
      // Move new image to front of new images (cannot mix types)
      const newIndex = index - existingImagesCount
      const newProductImages = [...productImages]
      const mainImage = newProductImages[newIndex]
      newProductImages.splice(newIndex, 1)
      newProductImages.unshift(mainImage)
      setProductImages(newProductImages)
    }
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={`${t("search")} ${t("products").toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          {t("add")} Product
        </Button>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("products")} ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {productsError && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Error loading products: {productsError.message}</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          )}
          
          {isLoadingProducts ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-8 w-[80px]" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>{t("category")}</TableHead>
                    <TableHead>{t("price")}</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchQuery ? "No products found matching your search" : "No products yet. Add your first product!"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Image
                              src={product.images?.[0] || "/placeholder.svg"}
                              alt={product.name}
                              width={50}
                              height={50}
                              className="rounded-md object-cover"
                            />
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">{product.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{getCategoryTranslation(product.category)}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{formatVND(product.price)}</TableCell>
                        <TableCell>
                          <span className={product.stockCount > 0 ? "text-green-600" : "text-red-600"}>
                            {product.stockCount} units
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.inStock ? "default" : "destructive"}>
                            {product.inStock ? t("inStock") : t("outOfStock")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t("edit")} Product
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProduct(product.id)} 
                                className="text-destructive"
                                disabled={deleteProductMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {deleteProductMutation.isPending ? "Deleting..." : `${t("delete")} Product`}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>

      {/* Product Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{editingProduct ? `${t("edit")} Product` : `${t("add")} New Product`}</DialogTitle>
              {!editingProduct && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={populateWithSampleData}
                  className="text-xs"
                >
                  Fill Sample Data
                </Button>
              )}
            </div>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">{t("price")} *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={productForm.originalPrice}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, originalPrice: e.target.value }))}
                  placeholder="0.00 (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockCount">Stock {t("quantity")}</Label>
                <Input
                  id="stockCount"
                  type="number"
                  value={productForm.stockCount}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, stockCount: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t("category")} *</Label>
              <Select
                value={productForm.category}
                onValueChange={(value) => setProductForm((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${t("category").toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder={`Enter product ${t("description").toLowerCase()}`}
                rows={3}
              />
            </div>

            {/* Features Section */}
            {/* <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Product Features</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              <div className="space-y-2">
                {productForm.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {productForm.features.length === 0 && (
                  <p className="text-sm text-muted-foreground">No features added yet. Click "Add Feature" to start.</p>
                )}
              </div>
            </div> */}

            {/* Specifications Section */}
            {/* <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Product Specifications</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSpecification}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </div>
              <div className="space-y-2">
                {Object.entries(productForm.specifications).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <Input
                      value={key}
                      onChange={(e) => updateSpecificationKey(key, e.target.value)}
                      placeholder="Specification name"
                      className="flex-1"
                    />
                    <Input
                      value={value}
                      onChange={(e) => updateSpecificationValue(key, e.target.value)}
                      placeholder="Specification value"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeSpecification(key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {Object.keys(productForm.specifications).length === 0 && (
                  <p className="text-sm text-muted-foreground">No specifications added yet. Click "Add Specification" to start.</p>
                )}
              </div>
            </div> */}

            {/* Image Management Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Product Images *</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Images
                    </label>
                  </Button>
                </div>
              </div>

              {/* Image Preview Grid */}
              <div className="border-2 border-dashed border-border rounded-lg p-4 min-h-[200px]">
                {getAllImages().length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-2" />
                    <p className="text-sm">No images uploaded</p>
                    <p className="text-xs">Upload images to see preview</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {getAllImages().map((image, index) => {
                      const isExistingImage = index < existingImages.length
                      const actualIndex = isExistingImage ? index : index - existingImages.length
                      
                      return (
                        <div
                          key={`${isExistingImage ? 'existing' : 'new'}-${actualIndex}`}
                          className="relative group border rounded-lg overflow-hidden bg-gray-50"
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                        >
                          <div className="aspect-square relative">
                            <Image
                              src={isExistingImage ? (image as string) : URL.createObjectURL(image as File)}
                              alt={`Product image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            {index === 0 && (
                              <div className="absolute top-2 left-2">
                                <Badge className="bg-primary text-primary-foreground text-xs">Main</Badge>
                              </div>
                            )}
                            {isExistingImage && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="outline" className="bg-white/90 text-xs">Existing</Badge>
                              </div>
                            )}
                          </div>

                          {/* Image Controls */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {index !== 0 && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setMainImage(index)}
                                className="text-xs"
                              >
                                Set Main
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => isExistingImage ? handleRemoveExistingImage(actualIndex) : handleRemoveImage(actualIndex)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {getAllImages().length > 0 && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• The first image will be used as the main product image</p>
                  <p>• Drag and drop to reorder images</p>
                  <p>• Click "Set Main" to make an image the primary one</p>
                  <p>• Total images: {getAllImages().length} (Existing: {existingImages.length}, New: {productImages.length})</p>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="inStock"
                checked={productForm.inStock}
                onCheckedChange={(checked) => setProductForm((prev) => ({ ...prev, inStock: checked }))}
              />
              <Label htmlFor="inStock">{t("inStock")}</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 bg-transparent" 
                onClick={() => setShowProductModal(false)}
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
              >
                {t("cancel")}
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSaveProduct}
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
              >
                {createProductMutation.isPending || updateProductMutation.isPending 
                  ? "Saving..." 
                  : editingProduct 
                    ? `${t("edit")} Product` 
                    : `${t("add")} Product`
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
