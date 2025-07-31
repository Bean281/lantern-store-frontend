"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, MoreHorizontal, Tag, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/components/language/language-context"
import { useToast } from "@/hooks/use-toast"
import { useCategories } from "@/hooks/use-categories"

// Extended category interface for UI (includes fields not yet supported by API)
interface ExtendedCategory {
  id?: string;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  icon: string;
  color: string;
  isActive: boolean;
  productCount: number;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

// Local mock data for extended fields (until API supports them)
const extendedCategoryData: Record<string, Omit<ExtendedCategory, 'name'>> = {
  'LED': {
    nameVi: "LED",
    description: "Energy-efficient LED lanterns with modern technology",
    descriptionVi: "Đèn lồng LED tiết kiệm năng lượng với công nghệ hiện đại",
    icon: "💡",
    color: "#FFD700", // Changed to Gold
    isActive: true,
    productCount: 8,
    sortOrder: 1,
  },
  'Oil': {
    nameVi: "Dầu",
    description: "Traditional oil lanterns with vintage charm",
    descriptionVi: "Đèn lồng dầu truyền thống với nét quyến rũ cổ điển",
    icon: "🔥",
    color: "#F59E0B",
    isActive: true,
    productCount: 5,
    sortOrder: 2,
  },
  'Solar': {
    nameVi: "Năng lượng mặt trời",
    description: "Eco-friendly solar-powered lighting solutions",
    descriptionVi: "Giải pháp chiếu sáng thân thiện với môi trường bằng năng lượng mặt trời",
    icon: "☀️",
    color: "#10B981",
    isActive: true,
    productCount: 3,
    sortOrder: 3,
  },
  'Decorative': {
    nameVi: "Trang trí",
    description: "Beautiful decorative lanterns for special occasions",
    descriptionVi: "Đèn lồng trang trí đẹp mắt cho những dịp đặc biệt",
    icon: "🎨",
    color: "#EC4899",
    isActive: true,
    productCount: 12,
    sortOrder: 4,
  },
  'Emergency': {
    nameVi: "Khẩn cấp",
    description: "Reliable emergency lighting for critical situations",
    descriptionVi: "Đèn chiếu sáng khẩn cấp đáng tin cậy cho các tình huống quan trọng",
    icon: "🚨",
    color: "#EF4444",
    isActive: false,
    productCount: 2,
    sortOrder: 5,
  },
}

export function CategoryManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ExtendedCategory | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    nameVi: "",
    description: "",
    descriptionVi: "",
    icon: "",
    color: "#3B82F6",
    isActive: true,
    sortOrder: 1,
  })

  const { t, language } = useLanguage()
  const { toast } = useToast()

  // Use real API
  const {
    categories: apiCategories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  } = useCategories()

  // Combine API data with extended local data
  const enhancedCategories: ExtendedCategory[] = apiCategories.map((category, index) => {
    const extendedData = extendedCategoryData[category.name] || {
      nameVi: category.name,
      description: `${category.name} category`,
      descriptionVi: `Danh mục ${category.name}`,
      icon: "📦",
      color: "#6B7280",
      isActive: true,
      productCount: 0,
      sortOrder: index + 1,
    }
    
    return {
      id: category.id, // Use the real API ID
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      ...extendedData,
    }
  })

  const filteredCategories = enhancedCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.nameVi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.descriptionVi.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddCategory = () => {
    setEditingCategory(null)
    setCategoryForm({
      name: "",
      nameVi: "",
      description: "",
      descriptionVi: "",
      icon: "",
      color: "#3B82F6",
      isActive: true,
      sortOrder: enhancedCategories.length + 1,
    })
    setShowCategoryModal(true)
  }

  const handleEditCategory = (category: ExtendedCategory) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      nameVi: category.nameVi,
      description: category.description,
      descriptionVi: category.descriptionVi,
      icon: category.icon,
      color: category.color,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    })
    setShowCategoryModal(true)
  }

  const handleSaveCategory = async () => {
    if (!categoryForm.name) {
      toast({
        title: t("error"),
        description: "Category name is required",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingCategory) {
        // For now, API only supports name updates
        // Note: Extended fields (nameVi, description, etc.) are preserved locally
        await updateCategory({
          categoryId: editingCategory.id!,
          categoryData: { name: categoryForm.name }
        })
        
        toast({
          title: t("success"),
          description: t("categoryUpdated") || "Category updated successfully",
        })
      } else {
        // Create new category
        await createCategory({ name: categoryForm.name })
        
        // Store extended data locally for new categories
        extendedCategoryData[categoryForm.name] = {
          nameVi: categoryForm.nameVi || categoryForm.name,
          description: categoryForm.description || `${categoryForm.name} category`,
          descriptionVi: categoryForm.descriptionVi || `Danh mục ${categoryForm.name}`,
          icon: categoryForm.icon || "📦",
          color: categoryForm.color,
          isActive: categoryForm.isActive,
          productCount: 0,
          sortOrder: categoryForm.sortOrder,
        }
        
        toast({
          title: t("success"),
          description: t("categoryAdded") || "Category added successfully",
        })
      }
      
      setShowCategoryModal(false)
      setCategoryForm({
        name: "",
        nameVi: "",
        description: "",
        descriptionVi: "",
        icon: "",
        color: "#3B82F6",
        isActive: true,
        sortOrder: 1,
      })
    } catch (error) {
      console.error('Failed to save category:', error)
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to save category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const category = enhancedCategories.find((c) => c.id === categoryId)
    if (category && category.productCount > 0) {
      toast({
        title: t("error"),
        description: t("cannotDeleteCategoryWithProducts") || "Cannot delete category with products",
        variant: "destructive",
      })
      return
    }

    try {
      await deleteCategory(categoryId)
      
      // Remove from local extended data using category name
      if (category) {
        delete extendedCategoryData[category.name]
      }
      
      toast({
        title: t("success"),
        description: t("categoryDeleted") || "Category deleted successfully",
      })
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast({
        title: t("error"),
        description: error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = (categoryId: string, isActive: boolean) => {
    // Update local extended data (API doesn't support status toggle yet)
    const categoryName = enhancedCategories.find(c => c.id === categoryId)?.name
    if (categoryName && extendedCategoryData[categoryName]) {
      extendedCategoryData[categoryName].isActive = isActive
    }

    toast({
      title: t("success"),
      description: isActive ? t("categoryActivated") || "Category activated" : t("categoryDeactivated") || "Category deactivated",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCategoryName = (category: ExtendedCategory) => {
    return language === "vi" ? category.nameVi : category.name
  }

  const getCategoryDescription = (category: ExtendedCategory) => {
    return language === "vi" ? category.descriptionVi : category.description
  }

  const predefinedColors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#84CC16", // Lime
    "#F97316", // Orange
    "#6B7280", // Gray
    "#FF69B4", // Hot Pink
    "#20B2AA", // Light Sea Green
    "#FFD700", // Gold
    "#FF6347", // Tomato
    "#4169E1", // Royal Blue
  ]

  const predefinedIcons = ["💡", "🔥", "☀️", "🎨", "🚨", "🏮", "🕯️", "⚡", "🌟", "🔦"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={`${t("search")} ${t("categories").toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="h-4 w-4 mr-2" />
          {t("add")} {t("category")}
        </Button>
      </div>

      {/* Categories Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Tag className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("totalCategories")}</p>
                <p className="text-2xl font-bold">{enhancedCategories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Tag className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("activeCategories")}</p>
                <p className="text-2xl font-bold">{enhancedCategories.filter((c) => c.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("totalProducts")}</p>
                <p className="text-2xl font-bold">{enhancedCategories.reduce((sum, c) => sum + c.productCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tag className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("avgProductsPerCategory")}</p>
                <p className="text-2xl font-bold">
                  {Math.round(enhancedCategories.reduce((sum, c) => sum + c.productCount, 0) / enhancedCategories.length) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t("categories")} ({isLoading ? "..." : filteredCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Error loading categories: {error.message}</p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          )}
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-6 w-[60px]" />
                  <Skeleton className="h-8 w-[80px]" />
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("category")}</TableHead>
                  <TableHead>{t("description")}</TableHead>
                  <TableHead>{t("products")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("sortOrder")}</TableHead>
                  <TableHead>{t("lastUpdated")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "No categories found matching your search" : "No categories yet. Add your first category!"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: category.color }}
                            >
                              {category.icon || <Tag className="h-5 w-5" />}
                            </div>
                            <div>
                              <div className="font-medium">{getCategoryName(category)}</div>
                              <div className="text-sm text-muted-foreground">
                                {language === "vi" ? category.name : category.nameVi}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm line-clamp-2">{getCategoryDescription(category)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{category.productCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={category.isActive}
                              onCheckedChange={(checked) => handleToggleStatus(category.id!, checked)}
                            />
                            <Badge variant={category.isActive ? "default" : "secondary"}>
                              {category.isActive ? t("active") : t("inactive")}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{category.sortOrder}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(category.updatedAt || category.createdAt || "")}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t("edit")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteCategory(category.id!)}
                                className="text-destructive"
                                disabled={category.productCount > 0 || isDeleting}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {isDeleting ? "Deleting..." : t("delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Category Modal */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? `${t("edit")} ${t("category")}` : `${t("add")} ${t("newCategory")}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("categoryName")} (English) *</Label>
                <Input
                  id="name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name in English"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameVi">{t("categoryName")} (Tiếng Việt) *</Label>
                <Input
                  id="nameVi"
                  value={categoryForm.nameVi}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, nameVi: e.target.value }))}
                  placeholder="Nhập tên danh mục bằng tiếng Việt"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("description")} (English)</Label>
              <Textarea
                id="description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description in English"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descriptionVi">{t("description")} (Tiếng Việt)</Label>
              <Textarea
                id="descriptionVi"
                value={categoryForm.descriptionVi}
                onChange={(e) => setCategoryForm((prev) => ({ ...prev, descriptionVi: e.target.value }))}
                placeholder="Nhập mô tả danh mục bằng tiếng Việt"
                rows={2}
              />
            </div>

            {/* Visual Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("categoryIcon")}</Label>
                <div className="grid grid-cols-5 gap-2">
                  {predefinedIcons.map((icon) => (
                    <Button
                      key={icon}
                      type="button"
                      variant={categoryForm.icon === icon ? "default" : "outline"}
                      className="h-10 w-10 p-0"
                      onClick={() => setCategoryForm((prev) => ({ ...prev, icon }))}
                    >
                      {icon}
                    </Button>
                  ))}
                </div>
                <Input
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, icon: e.target.value }))}
                  placeholder="Or enter custom emoji/icon"
                  className="mt-2"
                />
              </div>

              <div className="space-y-2">
                <Label>{t("categoryColor")}</Label>
                <div className="grid grid-cols-5 gap-2">
                  {predefinedColors.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      variant="outline"
                      className={`h-10 w-10 p-0 border-2 ${
                        categoryForm.color === color ? "border-primary" : "border-border"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setCategoryForm((prev) => ({ ...prev, color }))}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) => setCategoryForm((prev) => ({ ...prev, color: e.target.value }))}
                  className="mt-2 h-10"
                />
              </div>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">{t("sortOrder")}</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min="1"
                  value={categoryForm.sortOrder}
                  onChange={(e) =>
                    setCategoryForm((prev) => ({ ...prev, sortOrder: Number.parseInt(e.target.value) || 1 }))
                  }
                  placeholder="1"
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="isActive"
                  checked={categoryForm.isActive}
                  onCheckedChange={(checked) => setCategoryForm((prev) => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">{t("active")}</Label>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-2">
              <Label>{t("preview")}</Label>
              <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: categoryForm.color }}
                  >
                    {categoryForm.icon || <Tag className="h-6 w-6" />}
                  </div>
                  <div>
                    <div className="font-medium">
                      {language === "vi" ? categoryForm.nameVi || categoryForm.name : categoryForm.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {language === "vi"
                        ? categoryForm.descriptionVi || categoryForm.description
                        : categoryForm.description}
                    </div>
                  </div>
                  <Badge variant={categoryForm.isActive ? "default" : "secondary"} className="ml-auto">
                    {categoryForm.isActive ? t("active") : t("inactive")}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1 bg-transparent" 
                onClick={() => setShowCategoryModal(false)}
                disabled={isCreating || isUpdating}
              >
                {t("cancel")}
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSaveCategory}
                disabled={isCreating || isUpdating || !categoryForm.name}
              >
                {isCreating || isUpdating 
                  ? "Saving..." 
                  : editingCategory 
                    ? `${t("save")} ${t("changes")}` 
                    : `${t("add")} ${t("category")}`
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
