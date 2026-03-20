import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { SettingApi } from "../../shared/apiTypes";
import { settingsService } from "./settings.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    if (!tenantId) {
      return sendError(res, "tenantId es requerido", ["tenantId required"]);
    }
    const settings = await settingsService.getAll(tenantId);
    sendSuccess<SettingApi[]>(res, "Listado correctamente", settings);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar configuraciones";
    sendError(res, "Error al obtener configuraciones", [err], 500);
  }
});

router.get("/:key", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    if (!tenantId) {
      return sendError(res, "tenantId es requerido", ["tenantId required"]);
    }
    const setting = await settingsService.getByKey(tenantId, req.params.key);
    if (!setting) {
      return sendError(res, "Configuración no encontrada", ["Setting not found"], 404);
    }
    sendSuccess<SettingApi>(res, "Obtenido correctamente", setting);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener configuración";
    sendError(res, "Error al obtener configuración", [err], 500);
  }
});

router.put("/", async (req, res) => {
  try {
    const { tenantId, key, value } = req.body;
    if (!tenantId || !key?.trim()) {
      return sendError(res, "Datos incompletos", [
        "tenantId y key son requeridos",
      ]);
    }
    const setting = await settingsService.upsert({
      tenantId,
      key: String(key).trim(),
      value: value != null ? String(value) : "",
    });
    sendSuccess<SettingApi>(res, "Configuración guardada correctamente", setting);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al guardar configuración";
    sendError(res, "Error al guardar configuración", [err], 500);
  }
});

router.delete("/:key", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    if (!tenantId) {
      return sendError(res, "tenantId es requerido", ["tenantId required"]);
    }
    await settingsService.delete(tenantId, req.params.key);
    sendSuccess<null>(res, "Configuración eliminada correctamente", null);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al eliminar configuración";
    sendError(res, "Error al eliminar configuración", [err], 500);
  }
});

export const settingsController = router;
