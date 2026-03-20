import { settingsRepository } from "./settings.repository";
import type { UpsertSettingDto } from "./settings.dto";

export const settingsService = {
  getAll: (tenantId: string) => settingsRepository.findAll(tenantId),
  getByKey: (tenantId: string, key: string) =>
    settingsRepository.findByKey(tenantId, key),
  upsert: (data: UpsertSettingDto) => settingsRepository.upsert(data),
  delete: (tenantId: string, key: string) =>
    settingsRepository.delete(tenantId, key),
};
