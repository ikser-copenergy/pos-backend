import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";

function startOfLocalDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function calendarDaysDiff(expiresAt: Date, dayStart: Date) {
  const a = startOfLocalDay(expiresAt);
  return Math.round((a.getTime() - dayStart.getTime()) / (24 * 60 * 60 * 1000));
}

export type ExpiringSoonParams = {
  tenantId: string;
  days: number;
  locationId?: string;
  includeExpired: boolean;
  limit: number;
};

export type TopProductsParams = {
  tenantId: string;
  dateFrom: Date;
  dateTo: Date;
  locationId?: string;
  limit: number;
  sort: "quantity" | "revenue";
};

export type SalesByUserParams = {
  tenantId: string;
  dateFrom: Date;
  dateTo: Date;
  locationId?: string;
  limit: number;
  sort: "count" | "revenue";
};

function parseYmdToLocalStart(ymd: string) {
  const [y, m, d] = ymd.split("-").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

function parseYmdToLocalEnd(ymd: string) {
  const [y, m, d] = ymd.split("-").map((x) => parseInt(x, 10));
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 23, 59, 59, 999);
}

export function parseReportDateFrom(value: string | undefined): Date | null {
  if (!value?.trim()) return null;
  const t = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    return parseYmdToLocalStart(t);
  }
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseReportDateTo(value: string | undefined): Date | null {
  if (!value?.trim()) return null;
  const t = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    return parseYmdToLocalEnd(t);
  }
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const reportsRepository = {
  getTopProducts: async (params: TopProductsParams) => {
    const { tenantId, dateFrom, dateTo, locationId, limit, sort } = params;
    const whereSale = {
      tenantId,
      createdAt: { gte: dateFrom, lte: dateTo },
      ...(locationId ? { locationId } : {}),
    };

    const orderBy =
      sort === "revenue"
        ? { _sum: { total: "desc" as const } }
        : { _sum: { quantity: "desc" as const } };

    const rows = await prisma.saleItem.groupBy({
      by: ["productId"],
      where: { sale: whereSale },
      _sum: { quantity: true, total: true },
      orderBy,
      take: limit,
    });

    if (rows.length === 0) {
      return [] as {
        productId: string;
        productName: string;
        sku: string | null;
        quantitySold: number;
        revenue: number;
      }[];
    }

    const productIds = rows.map((r) => r.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, sku: true },
    });
    const pmap = new Map(products.map((p) => [p.id, p]));

    return rows.map((r) => {
      const p = pmap.get(r.productId);
      return {
        productId: r.productId,
        productName: p?.name ?? "—",
        sku: p?.sku ?? null,
        quantitySold: r._sum.quantity ?? 0,
        revenue: r._sum.total ?? 0,
      };
    });
  },

  getExpiringSoon: async (params: ExpiringSoonParams) => {
    const startOfToday = startOfLocalDay(new Date());
    const endOfWindow = new Date(startOfToday);
    endOfWindow.setDate(endOfWindow.getDate() + params.days);
    endOfWindow.setHours(23, 59, 59, 999);

    const dateFilter = params.includeExpired
      ? {
          OR: [
            { expiresAt: { gte: startOfToday, lte: endOfWindow } },
            { expiresAt: { lt: startOfToday } },
          ],
        }
      : { expiresAt: { gte: startOfToday, lte: endOfWindow } };

    const invWhere: Prisma.InventoryWhereInput = {
      quantity: { gt: 0 },
      variantId: null,
      ...(params.locationId ? { locationId: params.locationId } : {}),
    };

    const products = await prisma.product.findMany({
      where: {
        tenantId: params.tenantId,
        archived: false,
        trackStock: true,
        ...dateFilter,
        inventory: { some: invWhere },
      },
      select: {
        id: true,
        name: true,
        sku: true,
        expiresAt: true,
        inventory: {
          where: invWhere,
          include: { location: { select: { id: true, name: true } } },
        },
      },
      orderBy: { expiresAt: "asc" },
    });

    const rows: {
      productId: string;
      productName: string;
      sku: string | null;
      locationId: string;
      locationName: string;
      quantity: number;
      expiresAt: string;
      daysLeft: number;
    }[] = [];

    for (const p of products) {
      const ex = p.expiresAt;
      if (!ex) continue;
      for (const inv of p.inventory) {
        rows.push({
          productId: p.id,
          productName: p.name,
          sku: p.sku,
          locationId: inv.locationId,
          locationName: inv.location.name,
          quantity: inv.quantity,
          expiresAt: ex.toISOString(),
          daysLeft: calendarDaysDiff(ex, startOfToday),
        });
      }
    }

    rows.sort(
      (a, b) =>
        a.expiresAt.localeCompare(b.expiresAt) ||
        a.productName.localeCompare(b.productName) ||
        a.locationName.localeCompare(b.locationName)
    );

    return rows.slice(0, params.limit);
  },

  getSalesByUser: async (params: SalesByUserParams) => {
    const { tenantId, dateFrom, dateTo, locationId, limit, sort } = params;
    const whereSale = {
      tenantId,
      createdAt: { gte: dateFrom, lte: dateTo },
      ...(locationId ? { locationId } : {}),
    };

    const orderBy =
      sort === "revenue"
        ? { _sum: { total: "desc" as const } }
        : { _count: { id: "desc" as const } };

    const rows = await prisma.sale.groupBy({
      by: ["userId"],
      where: whereSale,
      _count: { id: true },
      _sum: { total: true },
      orderBy,
      take: limit,
    });

    if (rows.length === 0) {
      return [] as {
        userId: string;
        userName: string;
        userEmail: string;
        saleCount: number;
        totalRevenue: number;
      }[];
    }

    const userIds = rows.map((r) => r.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds }, tenantId },
      select: { id: true, name: true, email: true },
    });
    const umap = new Map(users.map((u) => [u.id, u]));

    return rows.map((r) => {
      const u = umap.get(r.userId);
      return {
        userId: r.userId,
        userName: u?.name ?? "—",
        userEmail: u?.email ?? "—",
        saleCount: r._count.id,
        totalRevenue: r._sum.total ?? 0,
      };
    });
  },
};
