import type { Response } from "express";
import type { ApiResponseSuccess } from "./types";

/** Envía respuesta exitosa. data es obligatorio y debe estar tipado explícitamente. */
export function sendSuccess<T>(res: Response, message: string, data: T, status = 200) {
  const body: ApiResponseSuccess<T> = { success: true, message, errors: [], data };
  res.status(status).json(body);
}

export function sendError(
  res: Response,
  message: string,
  errors: string[] = [],
  status = 400
) {
  res.status(status).json({ success: false, message, errors });
}
