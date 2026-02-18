import { CartView } from "@/components/cart-view"

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground">Shopping Cart</h1>
      <CartView />
    </div>
  )
}
