import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { LocationApi } from "../../shared/apiTypes";
import { locationsService } from "./locations.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const locations = await locationsService.getAll(tenantId);
    sendSuccess<LocationApi[]>(res, "Listado correctamente", locations);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar ubicaciones";
    sendError(res, "Error al obtener ubicaciones", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const location = await locationsService.getById(req.params.id);
    if (!location) {
      return sendError(res, "Ubicación no encontrada", ["Location not found"], 404);
    }
    sendSuccess<LocationApi>(res, "Obtenido correctamente", location);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener ubicación";
    sendError(res, "Error al obtener ubicación", [err], 500);
  }
});

router.post("/", async (req, res) => {
  try {
    const { tenantId, name, address } = req.body;
    if (!tenantId || !name) {
      return sendError(res, "Datos incompletos", [
        "tenantId y name son requeridos",
      ]);
    }
    const location = await locationsService.create({ tenantId, name, address });
    sendSuccess<LocationApi>(res, "Creado correctamente", location, 201);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al crear ubicación";
    sendError(res, "Error al crear ubicación", [err], 500);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, address } = req.body;
    const location = await locationsService.update(req.params.id, {
      name,
      address,
    });
    sendSuccess<LocationApi>(res, "Actualizado correctamente", location);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al actualizar ubicación";
    sendError(res, "Error al actualizar ubicación", [err], 500);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await locationsService.delete(req.params.id);
    sendSuccess<null>(res, "Eliminado correctamente", null);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al eliminar ubicación";
    sendError(res, "Error al eliminar ubicación", [err], 500);
  }
});

export const locationsController = router;
