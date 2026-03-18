import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { SupplierApi } from "../../shared/apiTypes";
import { suppliersService } from "./suppliers.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const suppliers = await suppliersService.getAll(tenantId);
    sendSuccess<SupplierApi[]>(res, "Listado correctamente", suppliers);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar proveedores";
    sendError(res, "Error al obtener proveedores", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const supplier = await suppliersService.getById(req.params.id);
    if (!supplier) {
      return sendError(res, "Proveedor no encontrado", [
        "Supplier not found",
      ], 404);
    }
    sendSuccess<SupplierApi>(res, "Obtenido correctamente", supplier);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener proveedor";
    sendError(res, "Error al obtener proveedor", [err], 500);
  }
});

export const suppliersController = router;
