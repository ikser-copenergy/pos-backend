import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { CustomerApi } from "../../shared/apiTypes";
import { customersService } from "./customers.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const customers = await customersService.getAll(tenantId);
    sendSuccess<CustomerApi[]>(res, "Listado correctamente", customers);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar clientes";
    sendError(res, "Error al obtener clientes", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await customersService.getById(req.params.id);
    if (!customer) {
      return sendError(res, "Cliente no encontrado", ["Customer not found"], 404);
    }
    sendSuccess<CustomerApi>(res, "Obtenido correctamente", customer);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener cliente";
    sendError(res, "Error al obtener cliente", [err], 500);
  }
});

export const customersController = router;
