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
import { useLanguage } from "@/components/language/language-context"
import { useToast } from "@/hooks/use-toast"

// Mock products data
const mockProducts = [
  {
    id: "1",
    name: "Classic LED Lantern",
    price: 29.99,
    image: "/placeholder.svg?height=100&width=100",
    images: [
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
      "/placeholder.svg?height=100&width=100",
    ],
    category: "LED",
    description: "Bright and energy-efficient LED lantern perfect for camping and outdoor activities.",
    inStock: true,
    stock: 25,
  },
  {
    id: "2",
    name: "Vintage Oil Lantern",
    price: 45.99,
    image: "/placeholder.svg?height=100&width=100",
    images: ["/placeholder.svg?height=100&width=100", "/placeholder.svg?height=100&width=100"],
    category: "Oil",
    description: "Traditional oil lantern with authentic vintage design and warm ambient lighting.",
    inStock: true,
    stock: 12,
  },
  {
    id: "3",
    name: "Solar Garden Lantern",
    price: 35.99,
    image: "/placeholder.svg?height=100&width=100",
    images: ["/placeholder.svg?height=100&width=100"],
    category: "Solar",
    description: "Eco-friendly solar-powered lantern ideal for garden and pathway lighting.",
    inStock: false,
    stock: 0,
  },
]

export function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    inStock: true,
    stock: "",
  })
  const [productImages, setProductImages] = useState<string[]>([])
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null)

  const { t } = useLanguage()
  const { toast } = useToast()

  const categories = [t("led"), t("oil"), t("solar"), t("decorative"), t("emergency")]

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: "",
      price: "",
      category: "",
      description: "",
      inStock: true,
      stock: "",
    })
    setProductImages([])
    setShowProductModal(true)
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      inStock: product.inStock,
      stock: product.stock.toString(),
    })
    setProductImages(product.images || [product.image])
    setShowProductModal(true)
  }

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.price || !productForm.category) {
      toast({
        title: t("error"),
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (productImages.length === 0) {
      toast({
        title: t("error"),
        description: "Please add at least one product image",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would save the product via API
    console.log("Saving product:", { ...productForm, images: productImages })
    toast({
      title: t("success"),
      description: editingProduct ? "Product updated successfully" : "Product added successfully",
    })
    setShowProductModal(false)
  }

  const handleDeleteProduct = (productId: string) => {
    // In a real app, this would delete the product via API
    console.log("Deleting product:", productId)
    toast({
      title: t("success"),
      description: "Product deleted successfully",
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setProductImages((prev) => [...prev, result])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
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

    const newImages = [...productImages]
    const draggedImage = newImages[draggedImageIndex]
    newImages.splice(draggedImageIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)

    setProductImages(newImages)
    setDraggedImageIndex(null)
  }

  const setMainImage = (index: number) => {
    const newImages = [...productImages]
    const mainImage = newImages[index]
    newImages.splice(index, 1)
    newImages.unshift(mainImage)
    setProductImages(newImages)
  }

  // Get translated category
  const getCategoryTranslation = (category: string) => {
    const categoryMap: { [key: string]: keyof typeof import("@/lib/i18n").translations.en } = {
      LED: "led",
      Oil: "oil",
      Solar: "solar",
      Decorative: "decorative",
      Emergency: "emergency",
    }
    return t(categoryMap[category] || "category")
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
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={50}
                        height={50}
                        className="rounded-md"
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
                  <TableCell className="font-medium">${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>{product.stock} units</span>
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
                        <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("delete")} Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No products found</div>
          )}
        </CardContent>
      </Card>

      {/* Product Modal */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? `${t("edit")} Product` : `${t("add")} New Product`}</DialogTitle>
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
                <Label htmlFor="stock">Stock {t("quantity")}</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
                  placeholder="0"
                />
              </div>
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
                {productImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mb-2" />
                    <p className="text-sm">No images uploaded</p>
                    <p className="text-xs">Upload images to see preview</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {productImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group border rounded-lg overflow-hidden bg-gray-50"
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-primary text-primary-foreground text-xs">Main</Badge>
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
                          <Button size="sm" variant="destructive" onClick={() => handleRemoveImage(index)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {productImages.length > 0 && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• The first image will be used as the main product image</p>
                  <p>• Drag and drop to reorder images</p>
                  <p>• Click "Set Main" to make an image the primary one</p>
                  <p>• Total images: {productImages.length}</p>
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
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowProductModal(false)}>
                {t("cancel")}
              </Button>
              <Button className="flex-1" onClick={handleSaveProduct}>
                {editingProduct ? `${t("edit")} Product` : `${t("add")} Product`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
