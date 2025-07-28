"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Plus, Minus, Heart, Star, ChevronLeft, ChevronRight, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ProductCard } from "@/components/products/product-card"
import { useCart } from "@/components/cart/cart-context"
import { useLanguage } from "@/components/language/language-context"
import { useToast } from "@/hooks/use-toast"

// Enhanced mock product data
const mockProducts = {
  "1": {
    id: "1",
    name: "Classic LED Lantern",
    price: 29.99,
    originalPrice: 39.99,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "LED",
    description:
      "Bright and energy-efficient LED lantern perfect for camping and outdoor activities. Features multiple brightness settings, long battery life, and weather-resistant construction. This premium lantern combines modern LED technology with classic design elements.",
    features: [
      "Ultra-bright LED technology with 400 lumens output",
      "3 brightness settings plus emergency red light mode",
      "Up to 50 hours battery life on low setting",
      "Weather-resistant IPX4 rating",
      "Lightweight and portable design",
      "Emergency red light mode for signaling",
      "Comfortable rubber grip handle",
      "Includes 4 AA batteries",
    ],
    specifications: {
      Dimensions: "8.5 x 4.2 x 4.2 inches",
      Weight: "1.2 lbs",
      Battery: "4 AA batteries (included)",
      "Light Output": "400 lumens max",
      Material: "ABS plastic with rubber grip",
      "Water Rating": "IPX4 splash resistant",
      "Battery Life": "Up to 50 hours",
      Warranty: "2 years manufacturer warranty",
    },
    inStock: true,
    stockCount: 25,
    rating: 4.5,
    reviewCount: 128,
    reviews: [
      {
        id: 1,
        name: "John D.",
        rating: 5,
        date: "2024-01-10",
        comment: "Excellent lantern! Very bright and the battery lasts forever. Perfect for camping trips.",
      },
      {
        id: 2,
        name: "Sarah M.",
        rating: 4,
        date: "2024-01-08",
        comment: "Great quality and very reliable. The different brightness settings are really useful.",
      },
      {
        id: 3,
        name: "Mike R.",
        rating: 5,
        date: "2024-01-05",
        comment: "Best lantern I've owned. Survived a week-long camping trip without any issues.",
      },
    ],
  },
  "2": {
    id: "2",
    name: "Vintage Oil Lantern",
    price: 45.99,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "Oil",
    description:
      "Traditional oil lantern with authentic vintage design and warm ambient lighting. Handcrafted with attention to detail.",
    features: [
      "Authentic vintage design",
      "Warm ambient lighting",
      "Adjustable wick",
      "Durable metal construction",
      "Glass chimney included",
      "Easy to refill",
    ],
    specifications: {
      Dimensions: "10 x 6 x 6 inches",
      Weight: "2.1 lbs",
      Fuel: "Kerosene or lamp oil",
      Material: "Steel with brass accents",
      "Burn Time": "8-12 hours per fill",
      Capacity: "12 oz fuel tank",
    },
    inStock: true,
    stockCount: 12,
    rating: 4.3,
    reviewCount: 89,
    reviews: [
      {
        id: 1,
        name: "Emma L.",
        rating: 4,
        date: "2024-01-12",
        comment: "Beautiful vintage design. Creates a lovely atmosphere for outdoor dinners.",
      },
      {
        id: 2,
        name: "Robert K.",
        rating: 5,
        date: "2024-01-09",
        comment: "Authentic feel and great build quality. Burns evenly and looks amazing.",
      },
    ],
  },
  "3": {
    id: "3",
    name: "Solar Garden Lantern",
    price: 35.99,
    images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    category: "Solar",
    description: "Eco-friendly solar-powered lantern ideal for garden and pathway lighting.",
    features: [
      "Solar powered - no batteries needed",
      "Automatic dusk-to-dawn operation",
      "Weather-resistant construction",
      "Warm white LED light",
    ],
    specifications: {
      Dimensions: "7 x 7 x 9 inches",
      Weight: "1.5 lbs",
      SolarPanel: "2W monocrystalline",
      BatteryCapacity: "1200mAh rechargeable",
    },
    inStock: false,
    stockCount: 50,
    rating: 4.0,
    reviewCount: 56,
    reviews: [],
  },
  "4": {
    id: "4",
    name: "Rechargeable Camping Lantern",
    price: 52.99,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "LED",
    description: "High-capacity rechargeable lantern with multiple brightness settings.",
    features: ["USB rechargeable battery", "5 brightness modes", "Power bank function", "Water-resistant IPX4"],
    specifications: {
      Dimensions: "4 x 4 x 7 inches",
      Weight: "1.3 lbs",
      BatteryCapacity: "4000mAh",
      ChargingTime: "4-5 hours",
    },
    inStock: true,
    stockCount: 18,
    rating: 4.7,
    reviewCount: 142,
    reviews: [
      {
        id: 1,
        name: "Alex T.",
        rating: 5,
        date: "2024-01-15",
        comment: "Amazing battery life! Used it for 3 days straight on a camping trip.",
      },
    ],
  },
  "5": {
    id: "5",
    name: "Decorative Paper Lantern",
    price: 18.99,
    images: ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"],
    category: "Decorative",
    description: "Beautiful handcrafted paper lantern for indoor decoration and events.",
    features: ["Handcrafted design", "Collapsible for easy storage", "LED compatible", "Available in multiple colors"],
    specifications: {
      Dimensions: "12 inch diameter",
      Weight: "0.3 lbs",
      Material: "Rice paper and bamboo",
      LightSource: "Not included",
    },
    inStock: true,
    stockCount: 50,
    rating: 4.2,
    reviewCount: 75,
    reviews: [],
  },
  "6": {
    id: "6",
    name: "Emergency Hurricane Lantern",
    price: 39.99,
    originalPrice: 49.99,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    category: "Emergency",
    description: "Reliable hurricane lantern designed for emergency situations and power outages.",
    features: [
      "Wind and storm resistant",
      "Burns for up to 12 hours",
      "Adjustable flame",
      "Durable metal construction",
    ],
    specifications: {
      Dimensions: "9 x 5 x 5 inches",
      Weight: "1.8 lbs",
      Fuel: "Kerosene or paraffin",
      TankCapacity: "12 oz",
    },
    inStock: true,
    stockCount: 35,
    rating: 4.8,
    reviewCount: 112,
    reviews: [
      {
        id: 1,
        name: "Maria S.",
        rating: 5,
        date: "2024-01-14",
        comment: "Perfect for power outages. Very reliable and gives great light.",
      },
      {
        id: 2,
        name: "David P.",
        rating: 4,
        date: "2024-01-11",
        comment: "Solid construction and works exactly as advertised. Great emergency backup.",
      },
    ],
  },
}

// Related products
const relatedProducts = [
  {
    id: "2",
    name: "Vintage Oil Lantern",
    price: 45.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Oil",
    description: "Traditional oil lantern with authentic vintage design.",
    inStock: true,
  },
  {
    id: "4",
    name: "Rechargeable Camping Lantern",
    price: 52.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "LED",
    description: "High-capacity rechargeable lantern with multiple brightness settings.",
    inStock: true,
  },
  {
    id: "5",
    name: "Decorative Paper Lantern",
    price: 18.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Decorative",
    description: "Beautiful handcrafted paper lantern for indoor decoration.",
    inStock: true,
  },
  {
    id: "6",
    name: "Emergency Hurricane Lantern",
    price: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Emergency",
    description: "Reliable hurricane lantern for emergency situations.",
    inStock: true,
  },
]

interface ProductPageProps {
  params: { id: string }
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = params
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()
  const { t } = useLanguage()
  const { toast } = useToast()

  const product = mockProducts[id as keyof typeof mockProducts]

  if (!product) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("productNotFound")}</h1>
          <Link href="/">
            <Button>{t("home")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: quantity,
    })
    toast({
      title: t("addedToCart"),
      description: `${quantity}x ${product.name} ${t("addedToCart").toLowerCase()}`,
    })
  }

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="container px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Breadcrumb className="hidden sm:block">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/?category=${product.category}`}>
                    {getCategoryTranslation(product.category)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">{product.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 lg:py-8">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              {product.originalPrice && (
                <Badge className="absolute top-4 left-4 bg-red-500">
                  {t("save")} ${(product.originalPrice - product.price).toFixed(2)}
                </Badge>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImage === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{getCategoryTranslation(product.category)}</Badge>
                {product.inStock && (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {t("inStock")} ({product.stockCount} available)
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">{renderStars(product.rating)}</div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} {t("reviews")})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl sm:text-4xl font-bold text-primary">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="font-medium">{t("quantity")}:</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t("addToCart")} - ${(product.price * quantity).toFixed(2)}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={isWishlisted ? "text-red-500 border-red-200" : ""}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
              </div>

              {!product.inStock && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">{t("outOfStock")}</p>
                  <p className="text-red-600 text-sm">This item is currently unavailable. Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Information Sections */}
        <div className="mt-12 lg:mt-16 space-y-8">
          {/* Features Section */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t("features")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Specifications Section */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t("specifications")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-border/50 last:border-0">
                      <span className="font-medium text-sm">{key}:</span>
                      <span className="text-muted-foreground text-sm text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Reviews Section */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t("reviews")}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">{renderStars(product.rating)}</div>
                    <span>{product.rating} out of 5</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <span>
                    {product.reviewCount} total {t("reviews")}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="border-b border-border/50 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-medium">{review.name}</span>
                            <div className="flex items-center">{renderStars(review.rating)}</div>
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                      </div>
                    ))}

                    {/* Add Review Button */}
                    <div className="pt-4">
                      <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                        Write a Review
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      No {t("reviews")} yet. Be the first to review this product!
                    </p>
                    <Button variant="outline">Write the First Review</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Related Products */}
        <div className="mt-12 lg:mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("relatedProducts")}</h2>
            <Link href="/">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
