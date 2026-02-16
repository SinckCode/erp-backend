import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  console.log("🔎 MONGO_URI =", env.MONGO_URI); // 👈 agrega esto

  if (!env.MONGO_URI) throw new Error("MONGO_URI no está definido");
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGO_URI);
  console.log("✅ MongoDB conectado");
}
