import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { httpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw httpError(400, "email y password son obligatorios");

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !user.active) throw httpError(401, "Credenciales inválidas");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw httpError(401, "Credenciales inválidas");

  const token = jwt.sign({ id: user._id.toString(), role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  res.json({
    ok: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});
