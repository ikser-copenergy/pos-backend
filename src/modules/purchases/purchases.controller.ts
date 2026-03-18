import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { PurchaseApi } from "../../shared/apiTypes";
import { purchasesService } from "./purchases.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const purchases = await purchasesService.getAll(tenantId);
    sendSuccess<PurchaseApi[]>(res, "Listado correctamente", purchases);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar compras";
    sendError(res, "Error al obtener compras", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const purchase = await purchasesService.getById(req.params.id);
    if (!purchase) {
      return sendError(res, "Compra no encontrada", [
        "Purchase not found",
      ], 404);
    }
    sendSuccess<PurchaseApi>(res, "Obtenido correctamente", purchase);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener compra";
    sendError(res, "Error al obtener compra", [err], 500);
  }
});

export const purchasesController = router;
