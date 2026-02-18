"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, UtensilsCrossed, ChefHat, ShoppingBag, Truck } from "lucide-react"

export function AuthLanding() {
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (mode === "signup" && !name) {
      setError("Name is required")
      return
    }
    if (!email || !password) {
      setError("All fields are required")
      return
    }
    if (mode === "signup" && password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    const result = mode === "login"
      ? await login(email, password)
      : await signup(name, email, password)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      router.push("/")
    }
  }

  const switchMode = () => {
    setMode(mode === "login" ? "signup" : "login")
    setError("")
    setName("")
    setEmail("")
    setPassword("")
  }

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background px-4 pb-16 pt-12 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-start lg:gap-16">
            {/* Left - Branding & Features */}
            <div className="flex-1 text-center lg:pt-8 lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <UtensilsCrossed className="h-4 w-4" />
                Fresh meals, delivered with love
              </div>
              <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Delicious Food,{" "}
                <span className="text-primary">One Click Away</span>
              </h1>
              <p className="mx-auto mb-10 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground lg:mx-0">
                Explore a curated selection of mouthwatering dishes from around the world. Sign in to start ordering your favorites.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-col items-center gap-4 sm:flex-row lg:items-start">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ChefHat className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Curated Menu</p>
                    <p className="text-xs text-muted-foreground">Chef-picked dishes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Easy Cart</p>
                    <p className="text-xs text-muted-foreground">Quick checkout</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Fast Delivery</p>
                    <p className="text-xs text-muted-foreground">At your doorstep</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Auth Card */}
            <div className="w-full max-w-md shrink-0">
              <Card className="border-border shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                    <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">
                    {mode === "login" ? "Welcome Back" : "Create Account"}
                  </CardTitle>
                  <CardDescription>
                    {mode === "login"
                      ? "Sign in to your FoodHub account"
                      : "Join FoodHub to start ordering"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && (
                      <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                      </div>
                    )}
                    {mode === "signup" && (
                      <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="text-foreground">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email" className="text-foreground">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="password" className="text-foreground">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {mode === "login" ? "Signing in..." : "Creating account..."}
                        </>
                      ) : (
                        mode === "login" ? "Sign In" : "Create Account"
                      )}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      {mode === "login" ? (
                        <>
                          {"Don't have an account? "}
                          <button type="button" onClick={switchMode} className="font-medium text-primary underline-offset-4 hover:underline">
                            Sign up
                          </button>
                        </>
                      ) : (
                        <>
                          {"Already have an account? "}
                          <button type="button" onClick={switchMode} className="font-medium text-primary underline-offset-4 hover:underline">
                            Sign in
                          </button>
                        </>
                      )}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
