"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useCart } from "@/components/cart/cart-context"
import { useLanguage } from "@/components/language/language-context"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  description: string
  inStock: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [showQuantityModal, setShowQuantityModal] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { t } = useLanguage()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.inStock) return
    setShowQuantityModal(true)
  }

  const handleConfirmAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    })
    setShowQuantityModal(false)
    setQuantity(1)
    toast({
      title: t("addedToCart"),
      description: `${quantity}x ${product.name} ${t("addedToCart").toLowerCase()}`,
    })
  }

  return (
    <>
      <div className="group relative bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square overflow-hidden relative">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.originalPrice && (
              <Badge className="absolute top-2 left-2 bg-red-500">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </Badge>
            )}
          </div>
        </Link>

        <div className="p-3 sm:p-4">
          <div className="flex items-start justify-between mb-2">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-sm sm:text-lg leading-tight hover:text-primary transition-colors line-clamp-2">
                {product.name}
              </h3>
            </Link>
            <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
              {product.category}
            </Badge>
          </div>

          <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2 hidden sm:block">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="gap-1 text-xs sm:text-sm"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{product.inStock ? t("addToCart") : t("outOfStock")}</span>
              <span className="sm:hidden">{product.inStock ? t("add") : t("outOfStock")}</span>
            </Button>
          </div>
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive">{t("outOfStock")}</Badge>
          </div>
        )}
      </div>

      {/* Quantity Selection Modal */}
      <Dialog open={showQuantityModal} onOpenChange={setShowQuantityModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("addToCart")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={80}
                height={80}
                className="rounded-lg"
              />
              <div>
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between text-lg font-semibold">
              <span>{t("total")}:</span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowQuantityModal(false)}>
                {t("cancel")}
              </Button>
              <Button className="flex-1" onClick={handleConfirmAdd}>
                {t("addToCart")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
