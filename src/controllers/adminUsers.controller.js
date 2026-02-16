import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { httpError } from "../utils/httpError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
  res.json(users);
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = "ADMIN", active = true } = req.body;

  if (!name || !email || !password) {
    throw httpError(400, "name, email y password son obligatorios");
  }

  const emailNorm = email.toLowerCase().trim();

  const exists = await User.findOne({ email: emailNorm });
  if (exists) throw httpError(409, "Email ya existe");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: String(name).trim(),
    email: emailNorm,
    passwordHash,
    role,
    active: Boolean(active),
  });

  res.json({
    ok: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, active: user.active },
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, active } = req.body;

  const user = await User.findById(id);
  if (!user) throw httpError(404, "Usuario no encontrado");

  if (email && email.toLowerCase().trim() !== user.email) {
    const emailNorm = email.toLowerCase().trim();
    const exists = await User.findOne({ email: emailNorm });
    if (exists) throw httpError(409, "Email ya existe");
    user.email = emailNorm;
  }

  if (name != null) user.name = String(name).trim();
  if (role != null) user.role = role;
  if (active != null) user.active = Boolean(active);

  if (password) {
    user.passwordHash = await bcrypt.hash(password, 10);
  }

  await user.save();
  res.json({ ok: true });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // evitar que el admin se borre a sí mismo
  if (req.user?.id === id) throw httpError(409, "No puedes eliminar tu propio usuario");

  const user = await User.findById(id);
  if (!user) throw httpError(404, "Usuario no encontrado");

  await User.deleteOne({ _id: id });
  res.json({ ok: true });
});
