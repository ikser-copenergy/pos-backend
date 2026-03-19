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

router.get("/sale/:saleId", async (req, res) => {
  try {
    const invoice = await invoicesService.findBySaleId(req.params.saleId);
    if (!invoice) {
      return sendError(res, "Factura no encontrada para esta venta", ["No invoice for this sale"], 404);
    }
    sendSuccess<InvoiceApi>(res, "Obtenido correctamente", invoice);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener factura";
    sendError(res, "Error al obtener factura", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const invoice = await invoicesService.getById(req.params.id);
    if (!invoice) {
      return sendError(res, "Factura no encontrada", ["Invoice not found"], 404);
    }
    sendSuccess<InvoiceApi>(res, "Obtenido correctamente", invoice);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener factura";
    sendError(res, "Error al obtener factura", [err], 500);
  }
});

router.post("/", async (req, res) => {
  try {
    const { saleId, tenantId, total, tax, customerName, customerRTN } = req.body;

    if (!saleId || !tenantId) {
      return sendError(res, "Datos incompletos", ["saleId y tenantId son requeridos"]);
    }

    const invoice = await invoicesService.createFromSale({
      tenantId,
      saleId,
      total: Number(total),
      tax: tax != null ? Number(tax) : undefined,
      customerName: customerName || undefined,
      customerRTN: customerRTN || undefined,
    });

    sendSuccess<InvoiceApi>(res, "Factura generada correctamente", invoice, 201);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al generar factura";
    const status = err === "Esta venta ya tiene una factura generada" ? 409 : 500;
    sendError(res, "Error al generar factura", [err], status);
  }
});

export const invoicesController = router;
