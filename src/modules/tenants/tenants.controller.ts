import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { TenantApi } from "../../shared/apiTypes";
import { tenantsService } from "./tenants.service";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const tenants = await tenantsService.getAll();
    sendSuccess<TenantApi[]>(res, "Listado correctamente", tenants);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar tenants";
    sendError(res, "Error al obtener tenants", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tenant = await tenantsService.getById(req.params.id);
    if (!tenant) {
      return sendError(res, "Tenant no encontrado", ["Tenant not found"], 404);
    }
    sendSuccess<TenantApi>(res, "Obtenido correctamente", tenant);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener tenant";
    sendError(res, "Error al obtener tenant", [err], 500);
  }
});

export const tenantsController = router;
