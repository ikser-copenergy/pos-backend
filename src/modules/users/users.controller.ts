import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import { usersService } from "./users.service";
import { requireAdmin } from "../../middleware/requireAdmin";

const router = Router();

router.use(requireAdmin);

router.get("/", async (req, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const users = await usersService.getAll(tenantId);
    sendSuccess(res, "Listado correctamente", users);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar usuarios";
    sendError(res, "Error al obtener usuarios", [err], 500);
  }
});

router.get("/count-cashiers", async (req, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const count = await usersService.countCashiers(tenantId);
    sendSuccess<{ count: number }>(res, "Ok", { count });
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al contar cajeros";
    sendError(res, "Error al contar cajeros", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await usersService.getById(req.params.id);
    if (!user || user.tenantId !== req.user!.tenantId) {
      return sendError(res, "Usuario no encontrado", ["User not found"], 404);
    }
    const { password: _, ...safe } = user;
    sendSuccess(res, "Obtenido correctamente", safe);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener usuario";
    sendError(res, "Error al obtener usuario", [err], 500);
  }
});

router.post("/", async (req, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const { name, email, password, phone } = req.body;
    if (!name?.trim() || !email?.trim() || !password) {
      return sendError(res, "Datos incompletos", ["name, email y password son requeridos"], 400);
    }
    const user = await usersService.create(tenantId, {
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone?.trim() || undefined,
    });
    sendSuccess(res, "Usuario creado correctamente", user, 201);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al crear usuario";
    const status = err.includes("Máximo") || err.includes("ya está registrado") ? 400 : 500;
    sendError(res, err, [err], status);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const { name, email, phone, password } = req.body;
    const user = await usersService.update(req.params.id, tenantId, {
      name: name?.trim(),
      email: email?.trim(),
      phone: phone ?? undefined,
      password: password || undefined,
    });
    if (!user) {
      return sendError(res, "Usuario no encontrado", ["User not found"], 404);
    }
    sendSuccess(res, "Usuario actualizado correctamente", user);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al actualizar usuario";
    const status = err.includes("ya está en uso") ? 400 : 500;
    sendError(res, err, [err], status);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const deleted = await usersService.delete(req.params.id, tenantId);
    if (!deleted) {
      return sendError(res, "Usuario no encontrado", ["User not found"], 404);
    }
    sendSuccess(res, "Usuario eliminado correctamente", { deleted: true });
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al eliminar usuario";
    sendError(res, "Error al eliminar usuario", [err], 500);
  }
});

export const usersController = router;
