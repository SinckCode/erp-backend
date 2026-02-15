import { httpError } from "../utils/httpError.js";

export function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) return next(httpError(401, "No autenticado"));
    if (!allowedRoles.includes(req.user.role)) {
      return next(httpError(403, "No autorizado"));
    }
    next();
  };
}
