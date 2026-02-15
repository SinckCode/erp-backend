import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { httpError } from "../utils/httpError.js";

export function auth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next(httpError(401, "Token requerido"));

  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch {
    next(httpError(401, "Token inválido o expirado"));
  }
}
