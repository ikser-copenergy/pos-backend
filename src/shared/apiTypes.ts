import type { Prisma } from "@prisma/client";

/** Tipos de respuesta API inferidos de Prisma con relaciones incluidas */

export type TenantApi = Prisma.TenantGetPayload<object>;

export type CategoryApi = Prisma.CategoryGetPayload<object>;

export type UserApi = Prisma.UserGetPayload<object>;

export type LocationApi = Prisma.LocationGetPayload<object>;

export type ProductApi = Prisma.ProductGetPayload<{
  include: { category: true; variants: true; images: true };
}>;

export type InventoryApi = Prisma.InventoryGetPayload<{
  include: { product: true; variant: true; location: true };
}>;

export type CustomerApi = Prisma.CustomerGetPayload<object>;

export type SupplierApi = Prisma.SupplierGetPayload<object>;

export type SaleApi = Prisma.SaleGetPayload<{
  include: { items: true; payments: true; customer: true };
}>;

export type PurchaseApi = Prisma.PurchaseGetPayload<{
  include: { items: true; supplier: true };
}>;

export type InvoiceApi = Prisma.InvoiceGetPayload<{
  include: { sale: true };
}>;

export interface UploadResponse {
  url: string;
}

export interface DeleteResponse {
  deleted: true;
}
