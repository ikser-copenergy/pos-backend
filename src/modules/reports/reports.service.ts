import { prisma } from "../../lib/prisma";
import { reportsRepository, parseReportDateFrom, parseReportDateTo } from "./reports.repository";
import type { ExpiringSoonParams } from "./reports.repository";

export const reportsService = {
  getTopProducts: async (args: {
    tenantId: string;
    dateFromStr: string | undefined;
    dateToStr: string | undefined;
    locationId?: string;
    limit: number;
    sort: "quantity" | "revenue";
  }) => {
    const dateFrom = parseReportDateFrom(args.dateFromStr);
    const dateTo = parseReportDateTo(args.dateToStr);
    if (!dateFrom || !dateTo) {
      throw new Error("dateFrom y dateTo son requeridos (formato YYYY-MM-DD o ISO)");
    }
    if (dateFrom.getTime() > dateTo.getTime()) {
      throw new Error("La fecha inicial no puede ser posterior a la final");
    }

    if (args.locationId) {
      const loc = await prisma.location.findFirst({
        where: { id: args.locationId, tenantId: args.tenantId },
      });
      if (!loc) {
        throw new Error("La ubicación no es válida para este negocio");
      }
    }

    return reportsRepository.getTopProducts({
      tenantId: args.tenantId,
      dateFrom,
      dateTo,
      locationId: args.locationId,
      limit: args.limit,
      sort: args.sort,
    });
  },

  getExpiringSoon: async (args: {
    tenantId: string;
    days: number;
    locationId?: string;
    includeExpired: boolean;
    limit: number;
  }) => {
    if (args.locationId) {
      const loc = await prisma.location.findFirst({
        where: { id: args.locationId, tenantId: args.tenantId },
      });
      if (!loc) {
        throw new Error("La ubicación no es válida para este negocio");
      }
    }
    const params: ExpiringSoonParams = {
      tenantId: args.tenantId,
      days: args.days,
      locationId: args.locationId,
      includeExpired: args.includeExpired,
      limit: args.limit,
    };
    return reportsRepository.getExpiringSoon(params);
  },

  getSalesByUser: async (args: {
    tenantId: string;
    dateFromStr: string | undefined;
    dateToStr: string | undefined;
    locationId?: string;
    limit: number;
    sort: "count" | "revenue";
  }) => {
    const dateFrom = parseReportDateFrom(args.dateFromStr);
    const dateTo = parseReportDateTo(args.dateToStr);
    if (!dateFrom || !dateTo) {
      throw new Error("dateFrom y dateTo son requeridos (formato YYYY-MM-DD o ISO)");
    }
    if (dateFrom.getTime() > dateTo.getTime()) {
      throw new Error("La fecha inicial no puede ser posterior a la final");
    }

    if (args.locationId) {
      const loc = await prisma.location.findFirst({
        where: { id: args.locationId, tenantId: args.tenantId },
      });
      if (!loc) {
        throw new Error("La ubicación no es válida para este negocio");
      }
    }

    return reportsRepository.getSalesByUser({
      tenantId: args.tenantId,
      dateFrom,
      dateTo,
      locationId: args.locationId,
      limit: args.limit,
      sort: args.sort,
    });
  },
};
