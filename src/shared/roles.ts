import type { UserRole as PrismaUserRole } from "@prisma/client";

/** Roles disponibles en el sistema */
export const USER_ROLES = ["ADMIN", "CASHIER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Máximo de cajeros permitidos por tenant */
export const MAX_CASHIERS_PER_TENANT = 3;

/** Rol de administrador (para verificaciones) */
export const ROLE_ADMIN: UserRole = "ADMIN";

/** Rol de cajero */
export const ROLE_CASHIER: UserRole = "CASHIER";

/** Verifica que un string sea un rol válido */
export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole);
}

/** Convierte Prisma UserRole a nuestro tipo */
export function toUserRole(role: PrismaUserRole): UserRole {
  return role as UserRole;
}
