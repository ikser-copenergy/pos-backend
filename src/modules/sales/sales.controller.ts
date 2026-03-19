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

router.post("/", async (req, res) => {
  try {
    const {
      tenantId,
      locationId,
      userId,
      customerId,
      total,
      tax,
      discount,
      status,
      items,
      payments,
    } = req.body;
    if (!tenantId || !locationId || !userId || !items?.length || !payments?.length) {
      return sendError(res, "Datos incompletos", [
        "tenantId, locationId, userId, items y payments son requeridos",
      ]);
    }
    const totalPayments = payments.reduce((s: number, p: { amount?: number }) => s + (Number(p.amount) || 0), 0);
    if (Math.abs(totalPayments - Number(total)) > 0.01) {
      return sendError(res, "El total de pagos no coincide con el total de la venta");
    }
    const sale = await salesService.create({
      tenantId,
      locationId,
      userId,
      customerId: customerId || undefined,
      total: Number(total),
      tax: tax != null ? Number(tax) : undefined,
      discount: discount != null ? Number(discount) : undefined,
      status: status || "COMPLETED",
      items: items.map((i: { productId: string; variantId?: string; quantity: number; unitPrice: number; total: number }) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
        total: Number(i.total),
      })),
      payments: payments.map((p: { method: string; amount: number; reference?: string }) => ({
        method: p.method,
        amount: Number(p.amount),
        reference: p.reference,
      })),
    });
    sendSuccess<SaleApi>(res, "Venta registrada correctamente", sale, 201);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al registrar venta";
    sendError(res, "Error al registrar venta", [err], 500);
  }
});

export const salesController = router;
