import type { Request, Response, NextFunction } from "express";
import { sendError } from "../shared/apiResponse";
import { ROLE_ADMIN } from "../shared/roles";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== ROLE_ADMIN) {
    return sendError(res, "Acceso denegado", ["Se requiere rol de administrador"], 403);
  }
  next();
}
