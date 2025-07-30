"use client"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { LanguageSwitcher } from "@/components/language-switcher"
import { OrderManagement } from "./order-management"
import { ProductManagement } from "./product-management"
import { CategoryManagement } from "./category-management"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/components/language/language-context"
import { useOrders } from "@/hooks/use-orders"
import { useProducts } from "@/hooks/use-products-query"

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  
  // Get real stats from APIs
  const { orderStats, isLoadingStats } = useOrders()
  const { stats: productStats, isLoadingStats: isLoadingProductStats } = useProducts()

  // Prepare stats data with real values
  const stats = [
    {
      title: t("totalOrders"),
      value: orderStats?.totalOrders?.toString() || "0",
      change: "+12%", // This could be calculated from historical data
      icon: ShoppingCart,
      loading: isLoadingStats,
    },
    {
      title: t("totalProducts"),
      value: productStats?.totalProducts?.toString() || "0",
      change: "+3", // This could be calculated from historical data
      icon: Package,
      loading: isLoadingProductStats,
    },
    {
      title: t("totalCustomers"),
      value: "89", // This would come from a customer stats API if available
      change: "+8%",
      icon: Users,
      loading: false,
    },
    {
      title: t("revenue"),
      value: orderStats?.totalRevenue ? `$${orderStats.totalRevenue.toFixed(2)}` : "$0.00",
      change: "+15%", // This could be calculated from historical data
      icon: TrendingUp,
      loading: isLoadingStats,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{t("adminDashboard")}</h1>
              <p className="text-muted-foreground">
                {language === "en" ? `Welcome back, ${user?.name}` : `Chào mừng trở lại, ${user?.name}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <LanguageSwitcher currentLanguage={language} onLanguageChange={setLanguage} />
              <Button variant="outline" onClick={logout}>
                {t("signOut")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {stat.loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span>{" "}
                      {language === "en" ? "from last month" : "từ tháng trước"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList>
            <TabsTrigger value="orders">{t("orderManagement")}</TabsTrigger>
            <TabsTrigger value="products">{t("productManagement")}</TabsTrigger>
            <TabsTrigger value="categories">{t("categoryManagement")}</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
