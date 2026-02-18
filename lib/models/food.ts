import mongoose, { Schema, type Document } from "mongoose"

export interface IFood extends Document {
  name: string
  description: string
  price: number
  image: string
  category: string
  addedBy: mongoose.Types.ObjectId
  createdAt: Date
}

const FoodSchema = new Schema<IFood>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  addedBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
})

export const Food = mongoose.models.Food || mongoose.model<IFood>("Food", FoodSchema)
