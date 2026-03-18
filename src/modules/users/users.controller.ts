import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { UserApi } from "../../shared/apiTypes";
import { usersService } from "./users.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const users = await usersService.getAll(tenantId);
    sendSuccess<UserApi[]>(res, "Listado correctamente", users);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar usuarios";
    sendError(res, "Error al obtener usuarios", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await usersService.getById(req.params.id);
    if (!user) {
      return sendError(res, "Usuario no encontrado", ["User not found"], 404);
    }
    sendSuccess<UserApi>(res, "Obtenido correctamente", user);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener usuario";
    sendError(res, "Error al obtener usuario", [err], 500);
  }
});

export const usersController = router;
