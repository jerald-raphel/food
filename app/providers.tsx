"use client"

import { AuthProvider } from "@/lib/context/auth-context"
import { CartProvider } from "@/lib/context/cart-context"
import type { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  )
}
