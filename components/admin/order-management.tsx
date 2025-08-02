"use client"

import { useState, useEffect } from "react"
import { Search, Eye, Edit, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/components/language/language-context"
import { useOrders } from "@/hooks/use-orders"
import { useToast } from "@/hooks/use-toast"
import { formatVND } from "@/lib/utils"
import type { Order } from "@/lib/api/orders/type"

export function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [editForm, setEditForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    notes: "",
    status: "",
  })

  const { t } = useLanguage()
  const { toast } = useToast()
  
  // Use the real orders API
  const {
    allOrders,
    isLoadingAllOrders,
    allOrdersError,
    updateOrderStatus,
    updateOrderInfoAdmin,
    isUpdatingStatus,
    isUpdatingInfoAdmin,
    refreshAllOrders,
  } = useOrders()

  const statusConfig = {
    NEW: { label: t("newOrders"), color: "bg-blue-500" },
    NEGOTIATING: { label: t("negotiating"), color: "bg-yellow-500" },
    SHIPPING: { label: t("shipping"), color: "bg-purple-500" },
    COMPLETED: { label: t("completed"), color: "bg-green-500" },
  }

  const filteredOrders = allOrders.filter(
    (order: Order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const ordersByStatus = {
    NEW: filteredOrders.filter((order: Order) => order.status === "NEW"),
    NEGOTIATING: filteredOrders.filter((order: Order) => order.status === "NEGOTIATING"),
    SHIPPING: filteredOrders.filter((order: Order) => order.status === "SHIPPING"),
    COMPLETED: filteredOrders.filter((order: Order) => order.status === "COMPLETED"),
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus({ 
        orderId, 
        status: newStatus as 'NEW' | 'NEGOTIATING' | 'SHIPPING' | 'COMPLETED' 
      })
      toast({
        title: "Order status updated",
        description: `Order ${orderId} status changed to ${newStatus}`,
      })
      refreshAllOrders()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setEditForm({
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      notes: order.notes || "",
      status: order.status,
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editForm.customerName || !editForm.phone || !editForm.address || !editingOrder) {
      return
    }

    try {
      await updateOrderInfoAdmin({
        orderId: editingOrder.id,
        updateData: {
          customerName: editForm.customerName,
          phone: editForm.phone,
          address: editForm.address,
          notes: editForm.notes,
        }
      })

      // Also update status if changed
      if (editForm.status !== editingOrder.status) {
        await updateOrderStatus({ 
          orderId: editingOrder.id, 
          status: editForm.status as 'NEW' | 'NEGOTIATING' | 'SHIPPING' | 'COMPLETED' 
        })
      }

      toast({
        title: "Order updated",
        description: `Order ${editingOrder.id} has been updated successfully`,
      })

      setShowEditModal(false)
      setEditingOrder(null)
      setEditForm({
        customerName: "",
        phone: "",
        address: "",
        notes: "",
        status: "",
      })
      refreshAllOrders()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      })
    }
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

  return (
    <div className="space-y-6 bg-background/50 rounded-lg p-6 border border-border/50">
      {/* Search and Filters */}
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-md border">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={`${t("search")} ${t("totalOrders").toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoadingAllOrders && (
        <div className="space-y-6 p-6 bg-muted/20 rounded-lg border">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {/* Error state */}
      {allOrdersError && (
        <div className="text-center py-8 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-red-500 mb-4">Error loading orders: {allOrdersError}</p>
          <Button onClick={refreshAllOrders}>Try Again</Button>
        </div>
      )}

      {/* Order Status Tabs */}
      {!isLoadingAllOrders && !allOrdersError && (
        <Tabs defaultValue="NEW" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-muted/50 p-1 rounded-lg mb-16 lg:mb-0">
            {Object.entries(statusConfig).map(([status, config]) => (
              <TabsTrigger 
                key={status} 
                value={status} 
                className="relative bg-background/50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm border-0 rounded-md"
              >
                {config.label}
                <Badge className="ml-2" variant="secondary">
                  {ordersByStatus[status as keyof typeof ordersByStatus].length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

        {Object.entries(statusConfig).map(([status, config]) => (
          <TabsContent key={status} value={status}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.color}`} />
                  {config.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>{t("totalCustomers").replace("Total ", "")}</TableHead>
                      {/* <TableHead>Items</TableHead> */}
                      <TableHead>{t("total")}</TableHead>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Tương tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ordersByStatus[status as keyof typeof ordersByStatus].map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-muted-foreground">{order.phone}</div>
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          <div className="text-sm">
                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                          </div>
                        </TableCell> */}
                        <TableCell className="font-medium">{formatVND(order.total)}</TableCell>
                        <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t("edit")} đơn hàng
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {ordersByStatus[status as keyof typeof ordersByStatus].length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">No orders in this status</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      )}

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-background border-border">
          <DialogHeader className="pb-4 border-b border-border/50">
            <DialogTitle className="text-foreground">Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 pt-4">
              {/* Customer Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <h4 className="font-semibold mb-2">Customer Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedOrder.customerName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedOrder.phone}
                    </p>
                    <p>
                      <strong>Address:</strong> {selectedOrder.address}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <h4 className="font-semibold mb-2">Order Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Order ID:</strong> {selectedOrder.id}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                    </p>
                    <div>
                      <strong>Status:</strong>
                      <Badge className="ml-2" variant="secondary">
                        {statusConfig[selectedOrder.status as keyof typeof statusConfig].label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                <h4 className="font-semibold mb-4">Order Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>{t("quantity")}</TableHead>
                      <TableHead>{t("price")}</TableHead>
                      <TableHead>{t("subtotal")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatVND(item.price)}</TableCell>
                        <TableCell>{formatVND(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-4">
                  <div className="text-lg font-semibold">
                    {t("total")}: {formatVND(selectedOrder.total)}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Status Update */}
              <div className="p-4 bg-accent/20 rounded-lg border border-border/50">
                <h4 className="font-semibold mb-3">Update Status</h4>
                <Select
                  defaultValue={selectedOrder.status}
                  onValueChange={(value) => handleStatusChange(selectedOrder.id, value)}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">{t("newOrders")}</SelectItem>
                    <SelectItem value="NEGOTIATING">{t("negotiating")}</SelectItem>
                    <SelectItem value="SHIPPING">{t("shipping")}</SelectItem>
                    <SelectItem value="COMPLETED">{t("completed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl bg-background border-border">
          <DialogHeader className="pb-4 border-b border-border/50">
            <DialogTitle className="text-foreground">
              {t("edit")} Order - {editingOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-customerName">Customer Name *</Label>
                  <Input
                    id="edit-customerName"
                    value={editForm.customerName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter customer name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">{t("phoneNumber")} *</Label>
                  <Input
                    id="edit-phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder={`Enter ${t("phoneNumber").toLowerCase()}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">{t("deliveryAddress")} *</Label>
                <Textarea
                  id="edit-address"
                  value={editForm.address}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder={`Enter ${t("deliveryAddress").toLowerCase()}`}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editForm.notes}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Order notes"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Order Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value) => setEditForm((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">{t("newOrders")}</SelectItem>
                    <SelectItem value="NEGOTIATING">{t("negotiating")}</SelectItem>
                    <SelectItem value="SHIPPING">{t("shipping")}</SelectItem>
                    <SelectItem value="COMPLETED">{t("completed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowEditModal(false)}>
                  {t("cancel")}
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSaveEdit}
                  disabled={!editForm.customerName || !editForm.phone || !editForm.address || isUpdatingInfoAdmin || isUpdatingStatus}
                >
                  {(isUpdatingInfoAdmin || isUpdatingStatus) ? `${t("loading")}...` : `${t("save")} Changes`}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
