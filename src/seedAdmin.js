import bcrypt from "bcrypt";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";

await connectDB();

const email = "admin@erp.com";
const exists = await User.findOne({ email });
if (!exists) {
  const passwordHash = await bcrypt.hash("Admin123*", 10);
  await User.create({
    name: "Admin",
    email,
    passwordHash,
    role: "ADMIN",
    active: true,
  });
  console.log("✅ Admin creado: admin@erp.com / Admin123*");
} else {
  console.log("ℹ️ Admin ya existe");
}

process.exit(0);
