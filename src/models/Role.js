import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // ADMIN, RH, GUARDIA, VENTAS, CONSULTA
  },
  { timestamps: true }
);

export const Role = mongoose.model("Role", roleSchema);
