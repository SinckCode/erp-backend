import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema(
  {
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    folio: { type: String, required: true, unique: true },
    soldAt: { type: Date, required: true },
    soldByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    buyerType: { type: String, enum: ["STUDENT", "WORKER", "PUBLIC"], required: true },
    buyerRefId: { type: String, default: "" }, // matricula o employeeNumber o vacío

    items: { type: [saleItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },

    status: { type: String, enum: ["CONFIRMED", "CANCELED"], default: "CONFIRMED" },
  },
  { timestamps: true }
);

saleSchema.index({ soldAt: -1 });

export const Sale = mongoose.model("Sale", saleSchema);
