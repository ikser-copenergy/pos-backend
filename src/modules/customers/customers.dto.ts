/** DTO para crear cliente */
export interface CreateCustomerDto {
  tenantId: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

/** DTO para actualizar cliente */
export interface UpdateCustomerDto {
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}
