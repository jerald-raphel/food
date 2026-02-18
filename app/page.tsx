"use client"

import { useAuth } from "@/lib/context/auth-context"
import { FoodGrid } from "@/components/food-grid"
import { AuthLanding } from "@/components/auth-landing"

export default function HomePage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <AuthLanding />
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <section className="mb-10">
        <h1 className="mb-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {"Welcome back, "}{user.name}{"!"}
        </h1>
        <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Browse our curated selection of meals from around the world. Order your favorites and enjoy a seamless dining experience.
        </p>
      </section>
      <FoodGrid />
    </div>
  )
}
