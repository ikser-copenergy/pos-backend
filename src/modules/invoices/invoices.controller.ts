import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { InvoiceApi } from "../../shared/apiTypes";
import { invoicesService } from "./invoices.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const invoices = await invoicesService.getAll(tenantId);
    sendSuccess<InvoiceApi[]>(res, "Listado correctamente", invoices);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar facturas";
    sendError(res, "Error al obtener facturas", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const invoice = await invoicesService.getById(req.params.id);
    if (!invoice) {
      return sendError(res, "Factura no encontrada", [
        "Invoice not found",
      ], 404);
    }
    sendSuccess<InvoiceApi>(res, "Obtenido correctamente", invoice);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener factura";
    sendError(res, "Error al obtener factura", [err], 500);
  }
});

export const invoicesController = router;
