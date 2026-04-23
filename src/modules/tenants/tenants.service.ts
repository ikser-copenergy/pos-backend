import { tenantsRepository } from "./tenants.repository";
import { deleteUploadByUrl } from "../../lib/upload";

export const tenantsService = {
  getAll: () => tenantsRepository.findAll(),
  getById: (id: string) => tenantsRepository.findById(id),
  create: (data: { name: string; subdomain: string; logoUrl?: string }) =>
    tenantsRepository.create(data),
  updateLogo: async (tenantId: string, newLogoUrl: string | null) => {
    const tenant = await tenantsRepository.findById(tenantId);
    if (!tenant) return null;
    if (tenant.logoUrl) {
      deleteUploadByUrl(tenant.logoUrl);
    }
    return tenantsRepository.update(tenantId, { logoUrl: newLogoUrl });
  },
};
