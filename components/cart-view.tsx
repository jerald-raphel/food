"use client"

import Image from "next/image"
import { useCart } from "@/lib/context/cart-context"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Minus, Plus, Trash2, ShoppingBag, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function CartView() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [placing, setPlacing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const handlePlaceOrder = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    setPlacing(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            foodId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          totalPrice,
        }),
      })

      if (res.ok) {
        clearCart()
        setOrderSuccess(true)
      } else {
        const data = await res.json()
        alert(data.error || "Failed to place order")
      }
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setPlacing(false)
    }
  }

  if (orderSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Order Placed Successfully!</h2>
        <p className="max-w-md text-muted-foreground">
          Thank you for your order. A confirmation email has been sent to your registered email address.
        </p>
        <Link href="/">
          <Button className="mt-4 gap-2">
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some delicious food to get started!</p>
        <Link href="/">
          <Button className="mt-2 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Browse Food
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden border-border">
              <CardContent className="flex gap-4 p-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <span className="font-semibold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-24 border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="mt-4 w-full gap-2"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Place Order
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
