"use client"

import { useAuth } from "@/lib/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, Package, LogOut, ShoppingBag, Calendar, ChevronDown, ChevronUp } from "lucide-react"

interface OrderItem {
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  _id: string
  items: OrderItem[]
  totalPrice: number
  orderDate: string
}

export function ProfileView() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders")
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } catch {
      // silently handle
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user, fetchOrders])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      {/* Profile Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
        <p className="text-muted-foreground">Manage your account and view your order history</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* User Info Card */}
        <div className="w-full lg:w-80">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-3xl font-bold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Orders</p>
                    <p className="font-medium text-foreground">{orders.length}</p>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Order History */}
        <div className="flex-1">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="mb-1 font-medium text-foreground">No orders yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start browsing our menu and place your first order!
                  </p>
                  <Button className="mt-4" onClick={() => router.push("/")}>
                    Browse Menu
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {orders.map((order) => (
                    <div key={order._id} className="rounded-lg border border-border bg-secondary/30 transition-colors hover:bg-secondary/50">
                      <button
                        className="flex w-full items-center justify-between px-4 py-3 text-left"
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {order.items.length} item{order.items.length > 1 ? "s" : ""}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(order.orderDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-primary">
                            {"$"}{order.totalPrice.toFixed(2)}
                          </span>
                          {expandedOrder === order._id ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {expandedOrder === order._id && (
                        <div className="border-t border-border px-4 pb-3 pt-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-3">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-10 w-10 rounded-lg object-cover"
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {"Qty: "}{item.quantity} {" x $"}{item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-medium text-foreground">
                                {"$"}{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
