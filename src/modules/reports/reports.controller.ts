import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type {
  TopProductRowApi,
  ExpiringSoonRowApi,
  SalesByUserRowApi,
} from "../../shared/apiTypes";
import { requireAdmin } from "../../middleware/requireAdmin";
import { reportsService } from "./reports.service";

const router = Router();
router.use(requireAdmin);

router.get("/top-products", async (req, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const dateFrom = req.query.dateFrom as string | undefined;
    const dateTo = req.query.dateTo as string | undefined;
    const locationId = (req.query.locationId as string | undefined)?.trim() || undefined;
    const limitRaw = Number(req.query.limit);
    const limit = Number.isFinite(limitRaw) ? Math.min(100, Math.max(1, Math.floor(limitRaw))) : 50;
    const sort = (req.query.sort as string) === "revenue" ? "revenue" : "quantity";

    const rows = await reportsService.getTopProducts({
      tenantId,
      dateFromStr: dateFrom,
      dateToStr: dateTo,
      locationId: locationId || undefined,
      limit,
      sort,
    });
    sendSuccess<TopProductRowApi[]>(res, "Reporte generado", rows);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al generar reporte";
    const is400 = err.includes("requeridos") || err.includes("no puede") || err.includes("válida");
    sendError(res, err, [err], is400 ? 400 : 500);
  }
});

router.get("/expiring-soon", async (req, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const daysRaw = Number(req.query.days);
    const days =
      Number.isFinite(daysRaw) && daysRaw > 0
        ? Math.min(365, Math.max(1, Math.floor(daysRaw)))
        : 7;
    const locationId = (req.query.locationId as string | undefined)?.trim() || undefined;
    /** Por defecto se incluyen lotes ya vencidos con stock; `includeExpired=false` los excluye. */
    const includeExpired = req.query.includeExpired !== "false";
    const limitRaw = Number(req.query.limit);
    const limit = Number.isFinite(limitRaw) ? Math.min(500, Math.max(1, Math.floor(limitRaw))) : 200;

    const rows = await reportsService.getExpiringSoon({
      tenantId,
      days,
      locationId: locationId || undefined,
      includeExpired,
      limit,
    });
    sendSuccess<ExpiringSoonRowApi[]>(res, "Reporte generado", rows);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al generar reporte";
    const is400 = err.includes("válida");
    sendError(res, err, [err], is400 ? 400 : 500);
  }
});

router.get("/sales-by-user", async (req, res) => {
  try {
    const tenantId = req.user!.tenantId;
    const dateFrom = req.query.dateFrom as string | undefined;
    const dateTo = req.query.dateTo as string | undefined;
    const locationId = (req.query.locationId as string | undefined)?.trim() || undefined;
    const limitRaw = Number(req.query.limit);
    const limit = Number.isFinite(limitRaw) ? Math.min(100, Math.max(1, Math.floor(limitRaw))) : 50;
    const sort = (req.query.sort as string) === "revenue" ? "revenue" : "count";

    const rows = await reportsService.getSalesByUser({
      tenantId,
      dateFromStr: dateFrom,
      dateToStr: dateTo,
      locationId: locationId || undefined,
      limit,
      sort,
    });
    sendSuccess<SalesByUserRowApi[]>(res, "Reporte generado", rows);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al generar reporte";
    const is400 = err.includes("requeridos") || err.includes("no puede") || err.includes("válida");
    sendError(res, err, [err], is400 ? 400 : 500);
  }
});

export const reportsController = router;
