"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useLanguage } from "@/components/language/language-context"
import { useOrders } from "@/hooks/use-orders"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/lib/api/orders/type"

export function OrderSearch() {
  const [phoneInput, setPhoneInput] = useState("")
  const [showResults, setShowResults] = useState(false)
  
  const { t } = useLanguage()
  const { toast } = useToast()
  
  const {
    phoneNumber,
    searchOrdersByPhone,
    clearSearch,
    ordersByPhone,
    isLoadingOrdersByPhone,
    ordersByPhoneError,
  } = useOrders()

  const handleSearch = () => {
    if (!phoneInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      })
      return
    }
    
    searchOrdersByPhone(phoneInput.trim())
    setShowResults(true)
  }

  const handleClear = () => {
    setPhoneInput("")
    clearSearch()
    setShowResults(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'NEW':
        return "bg-blue-500"
      case 'NEGOTIATING':
        return "bg-yellow-500"
      case 'SHIPPING':
        return "bg-purple-500"
      case 'COMPLETED':
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'NEW':
        return t("newOrders")
      case 'NEGOTIATING':
        return t("negotiating")
      case 'SHIPPING':
        return t("shipping")
      case 'COMPLETED':
        return t("completed")
      default:
        return status
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Search className="h-4 w-4" />
          Track My Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Track Your Order</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search Form */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter your phone number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoadingOrdersByPhone}>
              {isLoadingOrdersByPhone ? "Searching..." : "Search"}
            </Button>
            {showResults && (
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>

          {/* Loading State */}
          {isLoadingOrdersByPhone && (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          )}

          {/* Error State */}
          {ordersByPhoneError && (
            <div className="text-center py-4">
              <p className="text-red-500">Error: {ordersByPhoneError}</p>
            </div>
          )}

          {/* Results */}
          {showResults && !isLoadingOrdersByPhone && !ordersByPhoneError && (
            <div className="space-y-4">
              {ordersByPhone.length > 0 ? (
                <>
                  <h3 className="font-semibold">Your Orders ({ordersByPhone.length})</h3>
                  {ordersByPhone.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-medium">Order #{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Items:</span>
                            <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total:</span>
                            <span className="font-medium">${order.total.toFixed(2)}</span>
                          </div>
                          {order.notes && (
                            <div className="text-sm">
                              <span className="font-medium">Notes:</span> {order.notes}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <h5 className="font-medium mb-2">Items:</h5>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.name} x{item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No orders found for phone number: {phoneNumber}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please check your phone number and try again.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 