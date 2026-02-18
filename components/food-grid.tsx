"use client"

import { FoodCard } from "@/components/food-card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Loader2, Search } from "lucide-react"

interface Food {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

export function FoodGrid() {
  const [foods, setFoods] = useState<Food[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        // Seed first, then fetch
        await fetch("/api/seed", { method: "POST" })
        const res = await fetch("/api/food")
        const data = await res.json()
        setFoods(data.foods || [])
      } catch (error) {
        console.error("Failed to fetch foods:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFoods()
  }, [])

  const categories = ["All", ...Array.from(new Set(foods.map((f) => f.category)))]

  const filtered = foods.filter((food) => {
    const matchCategory = selectedCategory === "All" || food.category === selectedCategory
    const matchSearch =
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchSearch
  })

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading delicious food...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Search & Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring sm:w-72"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Food Grid */}
      {filtered.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-8">
          <p className="text-lg font-medium text-foreground">No food items found</p>
          <p className="text-sm text-muted-foreground">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  )
}
