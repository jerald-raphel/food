"use client"

import Image from "next/image"
import { useAuth } from "@/lib/context/auth-context"
import { useCart } from "@/lib/context/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Check } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface FoodCardProps {
  food: {
    _id: string
    name: string
    description: string
    price: number
    image: string
    category: string
  }
}

export function FoodCard({ food }: FoodCardProps) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const router = useRouter()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    if (!user) {
      router.push("/login")
      return
    }
    addToCart({ _id: food._id, name: food.name, price: food.price, image: food.image })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Card className="group overflow-hidden border-border transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={food.image}
          alt={food.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3">
          <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
            {food.category}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight text-foreground">{food.name}</h3>
          <span className="whitespace-nowrap rounded-md bg-primary px-2.5 py-1 text-sm font-bold text-primary-foreground">
            ${food.price.toFixed(2)}
          </span>
        </div>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {food.description}
        </p>
        <Button
          onClick={handleAddToCart}
          className="w-full gap-2"
          variant={added ? "secondary" : "default"}
          disabled={added}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
