"use client"

import { useState } from "react"
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
import { useLanguage } from "@/components/language/language-context"

// Mock orders data
const mockOrders = [
  {
    id: "LT001234",
    customerName: "John Doe",
    phone: "+1234567890",
    address: "123 Main St, City, State 12345",
    items: [
      { name: "Classic LED Lantern", quantity: 2, price: 29.99 },
      { name: "Solar Garden Lantern", quantity: 1, price: 35.99 },
    ],
    total: 95.97,
    status: "new",
    createdAt: "2024-01-15T10:30:00Z",
    notes: "Please deliver in the evening",
  },
  {
    id: "LT001235",
    customerName: "Jane Smith",
    phone: "+1234567891",
    address: "456 Oak Ave, City, State 12345",
    items: [{ name: "Vintage Oil Lantern", quantity: 1, price: 45.99 }],
    total: 45.99,
    status: "negotiating",
    createdAt: "2024-01-14T14:20:00Z",
    notes: "",
  },
  {
    id: "LT001236",
    customerName: "Bob Johnson",
    phone: "+1234567892",
    address: "789 Pine St, City, State 12345",
    items: [{ name: "Rechargeable Camping Lantern", quantity: 3, price: 52.99 }],
    total: 158.97,
    status: "shipping",
    createdAt: "2024-01-13T09:15:00Z",
    notes: "Urgent delivery requested",
  },
  {
    id: "LT001237",
    customerName: "Alice Brown",
    phone: "+1234567893",
    address: "321 Elm St, City, State 12345",
    items: [{ name: "Decorative Paper Lantern", quantity: 5, price: 18.99 }],
    total: 94.95,
    status: "completed",
    createdAt: "2024-01-12T16:45:00Z",
    notes: "",
  },
]

export function OrderManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    customerName: "",
    phone: "",
    address: "",
    notes: "",
    status: "",
  })

  const { t } = useLanguage()

  const statusConfig = {
    new: { label: t("newOrders"), color: "bg-blue-500" },
    negotiating: { label: t("negotiating"), color: "bg-yellow-500" },
    shipping: { label: t("shipping"), color: "bg-purple-500" },
    completed: { label: t("completed"), color: "bg-green-500" },
  }

  const filteredOrders = mockOrders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const ordersByStatus = {
    new: filteredOrders.filter((order) => order.status === "new"),
    negotiating: filteredOrders.filter((order) => order.status === "negotiating"),
    shipping: filteredOrders.filter((order) => order.status === "shipping"),
    completed: filteredOrders.filter((order) => order.status === "completed"),
  }

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // In a real app, this would update the order status via API
    console.log(`Updating order ${orderId} to status: ${newStatus}`)
  }

  const handleEditOrder = (order: any) => {
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

  const handleSaveEdit = () => {
    if (!editForm.customerName || !editForm.phone || !editForm.address) {
      return
    }

    // In a real app, this would update the order via API
    console.log(`Updating order ${editingOrder.id}:`, editForm)

    setShowEditModal(false)
    setEditingOrder(null)
    setEditForm({
      customerName: "",
      phone: "",
      address: "",
      notes: "",
      status: "",
    })
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
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
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

      {/* Order Status Tabs */}
      <Tabs defaultValue="new" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(statusConfig).map(([status, config]) => (
            <TabsTrigger key={status} value={status} className="relative">
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
                      <TableHead>Order ID</TableHead>
                      <TableHead>{t("totalCustomers").replace("Total ", "")}</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>{t("total")}</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
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
                        <TableCell>
                          <div className="text-sm">
                            {order.items.length} item{order.items.length > 1 ? "s" : ""}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
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
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t("edit")} Order
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

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
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
                <div>
                  <h4 className="font-semibold mb-2">Order Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Order ID:</strong> {selectedOrder.id}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
                    </p>
                    <p>
                      <strong>Status:</strong>
                      <Badge className="ml-2" variant="secondary">
                        {statusConfig[selectedOrder.status as keyof typeof statusConfig].label}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-2">Order Items</h4>
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
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-4">
                  <div className="text-lg font-semibold">
                    {t("total")}: ${selectedOrder.total.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <h4 className="font-semibold mb-2">Update Status</h4>
                <Select
                  defaultValue={selectedOrder.status}
                  onValueChange={(value) => handleStatusChange(selectedOrder.id, value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">{t("newOrders")}</SelectItem>
                    <SelectItem value="negotiating">{t("negotiating")}</SelectItem>
                    <SelectItem value="shipping">{t("shipping")}</SelectItem>
                    <SelectItem value="completed">{t("completed")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t("edit")} Order - {editingOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <div className="space-y-6">
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
                    <SelectItem value="new">{t("newOrders")}</SelectItem>
                    <SelectItem value="negotiating">{t("negotiating")}</SelectItem>
                    <SelectItem value="shipping">{t("shipping")}</SelectItem>
                    <SelectItem value="completed">{t("completed")}</SelectItem>
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
                  disabled={!editForm.customerName || !editForm.phone || !editForm.address}
                >
                  {t("save")} Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
