"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ShoppingCart, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { AuthModal } from "@/components/auth/auth-modal"
import { OrderSearch } from "@/components/orders/order-search"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useCart } from "@/components/cart/cart-context"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language/language-context"
import { useProducts } from "@/hooks/use-products-query"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
  const [sortBy, setSortBy] = useState("createdAt")
  const [showFilters, setShowFilters] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  const { items, getTotalItems } = useCart()
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()

  // Use React Query hooks for products
  const {
    products,
    categories: apiCategories,
    isLoading,
    error,
    totalProducts,
    currentPage,
    totalPages,
    searchProducts,
    filterByCategory,
    sortProducts,
    setPriceRange: setApiPriceRange,
    goToPage,
  } = useProducts()

  // Map API categories to display format
  const displayCategories = [
    { key: "All", label: t("all") },
    ...apiCategories.map((cat) => ({ key: cat, label: cat }))
  ]

  const sortOptions = [
    { value: "createdAt", label: t("newest") },
    { value: "price-low", label: t("priceLowToHigh") },
    { value: "price-high", label: t("priceHighToLow") },
    { value: "name", label: t("nameAZ") },
  ]

  // Update search when searchQuery changes
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchProducts(searchQuery)
      } else {
        searchProducts("")
      }
    }, 500) // Debounce search

    return () => clearTimeout(delayTimer)
  }, [searchQuery, searchProducts])

  // Update category filter when selectedCategory changes
  useEffect(() => {
    if (selectedCategory === "All") {
      filterByCategory("")
    } else {
      filterByCategory(selectedCategory)
    }
  }, [selectedCategory, filterByCategory])

  // Update price range when priceRange changes
  useEffect(() => {
    setApiPriceRange(priceRange[0], priceRange[1])
  }, [priceRange, setApiPriceRange])

  // Update sort when sortBy changes
  useEffect(() => {
    const sortMap: Record<string, { field: 'name' | 'price' | 'rating' | 'createdAt'; order: 'asc' | 'desc' }> = {
      "createdAt": { field: "createdAt", order: "desc" },
      "price-low": { field: "price", order: "asc" },
      "price-high": { field: "price", order: "desc" },
      "name": { field: "name", order: "asc" },
    }
    
    const sort = sortMap[sortBy] || sortMap["createdAt"]
    sortProducts(sort.field, sort.order)
  }, [sortBy, sortProducts])

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  const handleCategoryChange = (categoryKey: string) => {
    setSelectedCategory(categoryKey)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">V</span>
              </div>
              <span className="font-bold text-xl hidden sm:inline">Lồng Đèn Ông Vương</span>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={`${t("search")} lanterns...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Order Search */}
            <OrderSearch />
            
            {/* Language Switcher */}
            <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />

            {/* Cart Button */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setShowCart(true)}>
              <ShoppingCart className="h-5 w-5" />
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">{user.email}</div>
                  <div className="h-px bg-border my-1" />
                  {user.isAdmin && (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        {t("admin")}
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
                    {t("signOut")}
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleAuthClick("login")}>
                  {t("signIn")}
                </Button>
                <Button size="sm" onClick={() => handleAuthClick("register")}>
                  {t("signUp")}
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder={`${t("search")} lanterns...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Order Search */}
                  <OrderSearch />

                  {!user && (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => handleAuthClick("login")}
                      >
                        {t("signIn")}
                      </Button>
                      <Button className="w-full" onClick={() => handleAuthClick("register")}>
                        {t("signUp")}
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <ProductFilters
              categories={displayCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={(range) => setPriceRange([range[0], range[1]])}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Filters & Sort */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("filter")}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>{t("filter")}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                                <ProductFilters
              categories={displayCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={(range) => setPriceRange([range[0], range[1]])}
            />
                  </div>
                </SheetContent>
              </Sheet>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {t("sort")}: {sortOptions.find((opt) => opt.value === sortBy)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                    {sortOptions.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Desktop Sort */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Lồng Đèn Các Loại ({totalProducts})</h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {t("sort")}: {sortOptions.find((opt) => opt.value === sortBy)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                    {sortOptions.map((option) => (
                      <DropdownMenuRadioItem key={option.value} value={option.value}>
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">Error loading products: {error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {!isLoading && !error && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={showCart} onOpenChange={setShowCart} />

      {/* Auth Modal */}
      <AuthModal open={showAuth} onOpenChange={setShowAuth} mode={authMode} onModeChange={setAuthMode} />
    </div>
  )
}
