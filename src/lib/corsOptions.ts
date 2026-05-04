import type { CorsOptions } from "cors";

/**
 * CORS_ORIGINS: lista separada por comas (Origin completo que envía el navegador).
 * Vacío u omitido → reflejar el Origin de la petición (equivalente a permitir cualquiera).
 * "*" solo explícito → mismo comportamiento permisivo.
 */
export function corsOptionsFromEnv(): CorsOptions {
  const raw = process.env.CORS_ORIGINS?.trim();

  if (!raw || raw === "*") {
    return { origin: true };
  }

  const allowed = raw.split(",").map((s) => s.trim()).filter(Boolean);

  return {
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      callback(null, allowed.includes(origin));
    },
    credentials: true,
  };
}
