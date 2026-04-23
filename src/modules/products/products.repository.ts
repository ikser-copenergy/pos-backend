import { prisma } from "../../lib/prisma";
import { deleteUploadByUrl } from "../../lib/upload";

export const productsRepository = {
  findAll: (tenantId?: string, includeArchived = false, search?: string) =>
    prisma.product.findMany({
      where: {
        ...(tenantId ? { tenantId } : {}),
        ...(includeArchived ? {} : { archived: false }),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
                { barcode: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { category: true, tax: true, variants: true, images: true },
    }),
  findById: (id: string) =>
    prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        tax: true,
        variants: true,
        images: true,
        inventory: { where: { variantId: null }, include: { location: true } },
      },
    }),
  create: (data: {
    tenantId: string;
    name: string;
    taxId: string;
    description?: string;
    categoryId?: string;
    type: string;
    unitType?: string;
    sku?: string;
    barcode?: string;
    costPrice?: number;
    salePrice?: number;
    trackStock?: boolean;
    allowDecimalInventory?: boolean;
    expiresAt?: Date | null;
    imageUrl?: string;
  }) =>
    prisma.product.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        taxId: data.taxId,
        description: data.description,
        categoryId: data.categoryId,
        type: data.type as "SIMPLE" | "VARIANT" | "SERVICE",
        unitType: data.unitType,
        sku: data.sku,
        barcode: data.barcode,
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        trackStock: data.trackStock ?? true,
        allowDecimalInventory: data.allowDecimalInventory ?? true,
        expiresAt: data.expiresAt,
        images: data.imageUrl
          ? { create: { url: data.imageUrl } }
          : undefined,
      },
      include: { category: true, tax: true, variants: true, images: true },
    }),
  update: async (
    id: string,
    data: {
      name?: string;
      taxId?: string;
      description?: string;
      categoryId?: string;
      type?: string;
      unitType?: string;
      sku?: string;
      barcode?: string;
      costPrice?: number;
      salePrice?: number;
      trackStock?: boolean;
      allowDecimalInventory?: boolean;
      expiresAt?: Date | null;
      archived?: boolean;
      imageUrl?: string;
    }
  ) => {
    if (data.imageUrl !== undefined) {
      const existing = await prisma.productImage.findMany({ where: { productId: id } });
      for (const img of existing) {
        deleteUploadByUrl(img.url);
      }
      await prisma.productImage.deleteMany({ where: { productId: id } });
      if (data.imageUrl) {
        await prisma.productImage.create({
          data: { productId: id, url: data.imageUrl },
        });
      }
    }
    const { imageUrl, ...rest } = data;
    return prisma.product.update({
      where: { id },
      data: {
        ...rest,
        type: rest.type as "SIMPLE" | "VARIANT" | "SERVICE" | undefined,
      },
      include: { category: true, tax: true, variants: true, images: true },
    });
  },
};
