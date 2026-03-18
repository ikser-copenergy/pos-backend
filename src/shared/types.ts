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

/** Respuesta exitosa: data es obligatorio y tipado. */
export interface ApiResponseSuccess<T> {
  success: true;
  message: string;
  errors: [];
  data: T;
}

/** Respuesta de error: sin data. */
export interface ApiResponseError {
  success: false;
  message: string;
  errors: string[];
}

/** ApiResponse tipado. En éxito, data es obligatorio. */
export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export function apiSuccess<T>(message: string, data: T): ApiResponseSuccess<T> {
  return { success: true, message, errors: [], data };
}

export function apiError(message: string, errors: string[] = []): ApiResponseError {
  return { success: false, message, errors };
}
