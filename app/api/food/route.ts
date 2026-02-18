import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Food } from "@/lib/models/food"
import { getUser } from "@/lib/auth"

export async function GET() {
  try {
    await connectDB()
    const foods = await Food.find().sort({ createdAt: -1 }).lean()
    return NextResponse.json({ foods })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { name, description, price, image, category } = await req.json()

    if (!name || !description || !price || !image || !category) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const food = await Food.create({
      name,
      description,
      price: Number(price),
      image,
      category,
      addedBy: user.userId,
    })

    return NextResponse.json({ food, message: "Food added successfully" }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
