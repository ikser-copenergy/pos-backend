/** DTO para crear/actualizar configuración */
export interface UpsertSettingDto {
  tenantId: string;
  key: string;
  value: string;
}
