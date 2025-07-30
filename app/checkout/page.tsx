"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart/cart-context"
import { useLanguage } from "@/components/language/language-context"
import { useToast } from "@/hooks/use-toast"
import { useOrders } from "@/hooks/use-orders"
import type { CreateOrderDto } from "@/lib/api/orders/type"

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [orderId, setOrderId] = useState("")

  const { items, getTotalPrice, clearCart } = useCart()
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const { createOrder, isCreatingOrder } = useOrders()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare order data for API
      const orderData: CreateOrderDto = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        customerInfo: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes,
        },
        total: getTotalPrice(),
      }

      // Create order via API
      const response = await createOrder(orderData)
      
      setOrderId(response.order.id)
      setOrderSubmitted(true)
      clearCart()

      toast({
        title: t("orderSubmitted"),
        description: `${t("orderCreated")} #${response.order.id}. We'll contact you on Zalo soon.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0 && !orderSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container px-4 py-4">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t("home")}
              </Button>
            </Link>
          </div>
        </header>
        <div className="container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("cartIsEmpty")}</h1>
          <p className="text-muted-foreground mb-6">Add some products to your cart before checking out.</p>
          <Link href="/">
            <Button>{t("continueShopping")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{t("orderSubmitted")}</h1>
              <p className="text-muted-foreground">Your order #{orderId} has been received successfully.</p>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">What happens next?</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• We'll contact you on Zalo to confirm your order</li>
                      <li>• Discuss payment and delivery options</li>
                      <li>• Arrange delivery to your address</li>
                    </ul>
                  </div>
                  <div className="flex items-center justify-center gap-2 p-4 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Contact us on Zalo:</span>
                    <Button variant="outline" size="sm">
                      Open Zalo Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <Link href="/">
                <Button className="w-full">{t("continueShopping")}</Button>
              </Link>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => window.print()}>
                Print Order Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to {t("cart")}
            </Button>
          </Link>
        </div>
      </header>

      <div className="container px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t("checkout")}</h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t("deliveryInformation")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t("fullName")} *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder={`Enter your ${t("fullName").toLowerCase()}`}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("phoneNumber")} *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={`Enter your ${t("phoneNumber").toLowerCase()}`}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">{t("deliveryAddress")} *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder={`Enter your complete ${t("deliveryAddress").toLowerCase()}`}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">{t("orderNotes")} (Optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any special instructions or notes"
                        rows={2}
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || isCreatingOrder}>
                      {(isSubmitting || isCreatingOrder) ? `${t("loading")}...` : t("submitOrder")}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">{t("paymentInformation")}</h3>
                <p className="text-sm text-muted-foreground">
                  No payment is required now. We'll contact you on Zalo to discuss payment options and confirm your
                  order details.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t("subtotal")}:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>{t("total")}:</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
