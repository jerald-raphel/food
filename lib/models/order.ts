import mongoose, { Schema, type Document } from "mongoose"

export interface IOrderItem {
  foodId: mongoose.Types.ObjectId
  name: string
  price: number
  quantity: number
  image: string
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  userName: string
  userEmail: string
  items: IOrderItem[]
  totalPrice: number
  orderDate: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  foodId: { type: Schema.Types.ObjectId, ref: "Food" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
})

const OrderSchema = new Schema<IOrder>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: [OrderItemSchema],
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
})

export const Order = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)
