"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, ImageIcon } from "lucide-react"

const categories = ["Pizza", "Burgers", "Salads", "Indian", "Japanese", "Italian", "Mexican", "Thai", "Chinese", "Desserts", "Drinks", "Other"]

export function AddFoodForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
  })

  if (!user) {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!form.name || !form.description || !form.price || !form.image || !form.category) {
      setError("All fields are required")
      return
    }

    if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setError("Price must be a valid positive number")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to add food")
      } else {
        setSuccess("Food item added successfully!")
        setForm({ name: "", description: "", price: "", image: "", category: "" })
        setTimeout(() => router.push("/"), 1500)
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-start justify-center px-4 py-8">
      <Card className="w-full max-w-2xl border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-foreground">
            <Plus className="h-6 w-6" />
            Add New Food Item
          </CardTitle>
          <CardDescription>Fill in the details to add a new food item to the menu</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
            )}
            {success && (
              <div className="rounded-lg bg-secondary p-3 text-sm text-foreground">{success}</div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="food-name" className="text-foreground">Food Name</Label>
                <Input
                  id="food-name"
                  placeholder="e.g., Chicken Tikka"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="food-price" className="text-foreground">Price ($)</Label>
                <Input
                  id="food-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="9.99"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="food-description" className="text-foreground">Description</Label>
              <Textarea
                id="food-description"
                placeholder="Describe the food item..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="food-image" className="text-foreground">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Image URL
                  </span>
                </Label>
                <Input
                  id="food-image"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-foreground">Category</Label>
                <Select value={form.category} onValueChange={(val) => setForm({ ...form, category: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding Food...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Food Item
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
