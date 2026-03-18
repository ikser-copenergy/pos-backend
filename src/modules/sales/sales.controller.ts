import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { SaleApi } from "../../shared/apiTypes";
import { salesService } from "./sales.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const sales = await salesService.getAll(tenantId);
    sendSuccess<SaleApi[]>(res, "Listado correctamente", sales);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar ventas";
    sendError(res, "Error al obtener ventas", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const sale = await salesService.getById(req.params.id);
    if (!sale) {
      return sendError(res, "Venta no encontrada", ["Sale not found"], 404);
    }
    sendSuccess<SaleApi>(res, "Obtenido correctamente", sale);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener venta";
    sendError(res, "Error al obtener venta", [err], 500);
  }
});

export const salesController = router;
