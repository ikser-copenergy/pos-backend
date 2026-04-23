import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { TaxApi } from "../../shared/apiTypes";
import { taxesService } from "./taxes.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const taxes = await taxesService.getAll(tenantId);
    sendSuccess<TaxApi[]>(res, "Listado correctamente", taxes);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar impuestos";
    sendError(res, "Error al obtener impuestos", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tax = await taxesService.getById(req.params.id);
    if (!tax) {
      return sendError(res, "Impuesto no encontrado", ["Tax not found"], 404);
    }
    sendSuccess<TaxApi>(res, "Obtenido correctamente", tax);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener impuesto";
    sendError(res, "Error al obtener impuesto", [err], 500);
  }
});

router.post("/", async (req, res) => {
  try {
    const { tenantId, name, rate } = req.body;
    if (!tenantId || !name || rate == null) {
      return sendError(res, "Datos incompletos", [
        "tenantId, name y rate son requeridos",
      ]);
    }
    const tax = await taxesService.create({
      tenantId,
      name,
      rate: Number(rate),
    });
    sendSuccess<TaxApi>(res, "Creado correctamente", tax, 201);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al crear impuesto";
    sendError(res, "Error al crear impuesto", [err], 500);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, rate } = req.body;
    const tax = await taxesService.update(req.params.id, {
      name,
      rate: rate != null ? Number(rate) : undefined,
    });
    sendSuccess<TaxApi>(res, "Actualizado correctamente", tax);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al actualizar impuesto";
    sendError(res, "Error al actualizar impuesto", [err], 500);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await taxesService.delete(req.params.id);
    sendSuccess<null>(res, "Eliminado correctamente", null);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al eliminar impuesto";
    sendError(res, "Error al eliminar impuesto", [err], 500);
  }
});

export const taxesController = router;
