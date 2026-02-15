import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true }, // ISBN o código interno
    title: { type: String, required: true, trim: true },
    author: { type: String, default: "" },
    category: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
