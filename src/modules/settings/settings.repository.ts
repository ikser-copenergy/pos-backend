import { prisma } from "../../lib/prisma";
import type { UpsertSettingDto } from "./settings.dto";

export const settingsRepository = {
  findAll: (tenantId: string) =>
    prisma.setting.findMany({
      where: { tenantId },
      orderBy: { key: "asc" },
    }),

  findByKey: (tenantId: string, key: string) =>
    prisma.setting.findUnique({
      where: { tenantId_key: { tenantId, key } },
    }),

  upsert: (data: UpsertSettingDto) =>
    prisma.setting.upsert({
      where: {
        tenantId_key: { tenantId: data.tenantId, key: data.key },
      },
      update: { value: data.value },
      create: {
        tenantId: data.tenantId,
        key: data.key,
        value: data.value,
      },
    }),

  delete: (tenantId: string, key: string) =>
    prisma.setting.delete({
      where: { tenantId_key: { tenantId, key } },
    }),
};
