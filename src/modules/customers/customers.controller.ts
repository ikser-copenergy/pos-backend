import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { CustomerApi, CustomerWithDebtApi } from "../../shared/apiTypes";
import type { PaginatedResult } from "../../shared/types";
import { customersService } from "./customers.service";

const router = Router();

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const search = (req.query.search as string | undefined)?.trim() || undefined;
    const pageParam = req.query.page as string | undefined;
    const limitParam = req.query.limit as string | undefined;

    const usePagination = pageParam != null || limitParam != null;
    const page = Math.max(1, parseInt(pageParam ?? String(DEFAULT_PAGE), 10) || DEFAULT_PAGE);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(limitParam ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
    );

    if (usePagination) {
      const result = await customersService.getAllPaginated(tenantId, page, limit);
      sendSuccess<PaginatedResult<CustomerWithDebtApi>>(res, "Listado correctamente", result);
    } else {
      const customers = await customersService.getAll(tenantId, search);
      sendSuccess<CustomerApi[]>(res, "Listado correctamente", customers);
    }
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

router.post("/", async (req, res) => {
  try {
    const { tenantId, name, phone, email, address } = req.body;
    if (!tenantId || !name?.trim()) {
      return sendError(res, "Datos incompletos", [
        "tenantId y name son requeridos",
      ]);
    }
    const customer = await customersService.create({
      tenantId,
      name: String(name).trim(),
      phone: phone != null ? String(phone).trim() || undefined : undefined,
      email: email != null ? String(email).trim() || undefined : undefined,
      address: address != null ? String(address).trim() || undefined : undefined,
    });
    sendSuccess<CustomerApi>(res, "Cliente creado correctamente", customer, 201);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al crear cliente";
    sendError(res, "Error al crear cliente", [err], 500);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const customer = await customersService.getById(req.params.id);
    if (!customer) {
      return sendError(res, "Cliente no encontrado", ["Customer not found"], 404);
    }
    const updated = await customersService.update(req.params.id, {
      name: name != null ? String(name).trim() : undefined,
      phone: phone !== undefined ? (String(phone).trim() || null) : undefined,
      email: email !== undefined ? (String(email).trim() || null) : undefined,
      address: address !== undefined ? (String(address).trim() || null) : undefined,
    });
    sendSuccess<CustomerApi>(res, "Cliente actualizado correctamente", updated);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al actualizar cliente";
    sendError(res, "Error al actualizar cliente", [err], 500);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const customer = await customersService.getById(req.params.id);
    if (!customer) {
      return sendError(res, "Cliente no encontrado", ["Customer not found"], 404);
    }
    await customersService.delete(req.params.id);
    sendSuccess<null>(res, "Cliente eliminado correctamente", null);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al eliminar cliente";
    sendError(res, "Error al eliminar cliente", [err], 500);
  }
});

export const customersController = router;
