/** Exportación central de tipos y helpers de API del backend */

export type {
  ApiResponse,
  ApiResponseSuccess,
  ApiResponseError,
  TenantApi,
  CategoryApi,
  UserApi,
  LocationApi,
  ProductApi,
  InventoryApi,
  CustomerApi,
  SupplierApi,
  SettingApi,
  SaleApi,
  PurchaseApi,
  InvoiceApi,
  UploadResponse,
  DeleteResponse,
} from "./apiTypes";

export { sendSuccess, sendError } from "./apiResponse";
export { apiSuccess, apiError } from "./types";
export type { PaginationParams, PaginatedResult } from "./types";
