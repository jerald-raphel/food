import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Order } from "@/lib/models/order"
import { getUser } from "@/lib/auth"
import { sendOrderConfirmation } from "@/lib/email"

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const orders = await Order.find({ userId: user.userId }).sort({ orderDate: -1 }).lean()

    return NextResponse.json({ orders }, { status: 200 })
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
    const { items, totalPrice } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    const order = await Order.create({
      userId: user.userId,
      userName: user.name,
      userEmail: user.email,
      items,
      totalPrice,
      orderDate: new Date(),
    })

    // Send confirmation email
    try {
      await sendOrderConfirmation({
        userName: user.name,
        userEmail: user.email,
        items,
        totalPrice,
        orderDate: order.orderDate,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Order still succeeds even if email fails
    }

    return NextResponse.json({ order, message: "Order placed successfully!" }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
