import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Food } from "@/lib/models/food"

const defaultFoods = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with fresh mozzarella, basil, and tomato sauce on a crispy crust",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&h=400&fit=crop",
    category: "Pizza",
  },
  {
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, cheese, and special sauce",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    category: "Burgers",
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with parmesan, croutons, and creamy caesar dressing",
    price: 8.49,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop",
    category: "Salads",
  },
  {
    name: "Chicken Biryani",
    description: "Aromatic basmati rice layered with spiced chicken and caramelized onions",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop",
    category: "Indian",
  },
  {
    name: "Sushi Platter",
    description: "Assorted fresh sushi rolls with salmon, tuna, and avocado",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop",
    category: "Japanese",
  },
  {
    name: "Pasta Carbonara",
    description: "Creamy Italian pasta with pancetta, egg yolk, and pecorino romano",
    price: 13.49,
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&h=400&fit=crop",
    category: "Italian",
  },
  {
    name: "Tacos Al Pastor",
    description: "Marinated pork tacos with pineapple, cilantro, and onion on corn tortillas",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop",
    category: "Mexican",
  },
  {
    name: "Pad Thai",
    description: "Stir-fried rice noodles with shrimp, peanuts, bean sprouts, and tamarind sauce",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&h=400&fit=crop",
    category: "Thai",
  },
]

export async function POST() {
  try {
    await connectDB()
    const existingCount = await Food.countDocuments()
    if (existingCount > 0) {
      return NextResponse.json({ message: "Database already seeded", count: existingCount })
    }

    await Food.insertMany(defaultFoods)
    return NextResponse.json({ message: "Database seeded successfully", count: defaultFoods.length })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
