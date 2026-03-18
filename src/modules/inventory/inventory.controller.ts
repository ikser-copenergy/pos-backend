import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { InventoryApi } from "../../shared/apiTypes";
import { inventoryService } from "./inventory.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const inventory = await inventoryService.getAll(tenantId);
    sendSuccess<InventoryApi[]>(res, "Listado correctamente", inventory);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar inventario";
    sendError(res, "Error al obtener inventario", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await inventoryService.getById(req.params.id);
    if (!item) {
      return sendError(res, "Registro de inventario no encontrado", [
        "Inventory item not found",
      ], 404);
    }
    sendSuccess<InventoryApi>(res, "Obtenido correctamente", item);
  } catch (e) {
    const err =
      e instanceof Error ? e.message : "Error al obtener inventario";
    sendError(res, "Error al obtener inventario", [err], 500);
  }
});

router.post("/", async (req, res) => {
  try {
    const { tenantId, productId, variantId, locationId, quantity } = req.body;
    if (!tenantId || !productId || !locationId) {
      return sendError(res, "Datos incompletos", [
        "tenantId, productId y locationId son requeridos",
      ]);
    }
    const item = await inventoryService.create({
      tenantId,
      productId,
      variantId,
      locationId,
      quantity: quantity ?? 0,
    });
    sendSuccess<InventoryApi>(res, "Creado correctamente", item, 201);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al crear inventario";
    sendError(res, "Error al crear inventario", [err], 500);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await inventoryService.update(req.params.id, { quantity });
    sendSuccess(res, "Actualizado correctamente", item);
  } catch (e) {
    const err =
      e instanceof Error ? e.message : "Error al actualizar inventario";
    sendError(res, "Error al actualizar inventario", [err], 500);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await inventoryService.delete(req.params.id);
    sendSuccess<null>(res, "Eliminado correctamente", null);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al eliminar inventario";
    sendError(res, "Error al eliminar inventario", [err], 500);
  }
});

export const inventoryController = router;
