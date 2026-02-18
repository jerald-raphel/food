"use client"

import Link from "next/link"
import { useAuth } from "@/lib/context/auth-context"
import { useCart } from "@/lib/context/cart-context"
import { ShoppingCart, UtensilsCrossed, LogOut, Plus, Menu, X, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">FoodHub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link href="/">
                <Button variant="ghost" size="sm">Home</Button>
              </Link>
              <Link href="/add-food">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  Add Food
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="sm" className="relative gap-1.5">
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                  {totalItems > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[11px] font-semibold text-primary-foreground">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              <div className="ml-2 flex items-center gap-3 border-l border-border pl-4">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <UserCircle className="h-4 w-4" />
                    {user.name}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout} className="gap-1.5">
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-2 pt-3">
            {user ? (
              <>
                <Link href="/" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Home</Button>
                </Link>
                <Link href="/add-food" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Add Food
                  </Button>
                </Link>
                <Link href="/cart" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Cart {totalItems > 0 && `(${totalItems})`}
                  </Button>
                </Link>
                <Link href="/profile" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
                <div className="border-t border-border pt-2">
                  <p className="px-4 py-1 text-sm text-muted-foreground">{user.name}</p>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive"
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">Login</Button>
                </Link>
                <Link href="/signup" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
