export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type {
  ApiResponse,
  ApiResponseSuccess,
  ApiResponseError,
} from "./apiTypes";

import type { ApiResponseSuccess, ApiResponseError } from "./apiTypes";

export function apiSuccess<T>(
  message: string,
  data: T
): ApiResponseSuccess<T> {
  return { success: true, message, errors: [], data };
}

export function apiError(
  message: string,
  errors: string[] = []
): ApiResponseError {
  return { success: false, message, errors };
}
