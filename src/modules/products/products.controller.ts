import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { ProductApi } from "../../shared/apiTypes";
import { productsService } from "./products.service";

const router = Router();

function parseBodyExpiresAt(
  v: unknown
): Date | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  if (typeof v === "string") {
    const t = v.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
      const [y, m, d] = t.split("-").map((x) => parseInt(x, 10));
      if (y && m && d) {
        return new Date(y, m - 1, d, 12, 0, 0, 0);
      }
    }
    const dt = new Date(t);
    return Number.isNaN(dt.getTime()) ? undefined : dt;
  }
  return undefined;
}

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const includeArchived = req.query.includeArchived === "true";
    const search = req.query.search as string | undefined;
    const products = await productsService.getAll(tenantId, includeArchived, search);
    sendSuccess<ProductApi[]>(res, "Listado correctamente", products);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar productos";
    sendError(res, "Error al obtener productos", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await productsService.getById(req.params.id);
    if (!product) {
      return sendError(res, "Producto no encontrado", ["Product not found"], 404);
    }
    sendSuccess<ProductApi>(res, "Obtenido correctamente", product);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener producto";
    sendError(res, "Error al obtener producto", [err], 500);
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      tenantId,
      name,
      taxId,
      description,
      categoryId,
      type,
      unitType,
      sku,
      barcode,
      costPrice,
      salePrice,
      trackStock,
      allowDecimalInventory,
      expiresAt,
      imageUrl,
      inventoryByLocation,
    } = req.body;
    if (!tenantId || !name || !type || !taxId) {
      return sendError(res, "Datos incompletos", [
        "tenantId, name, type y taxId son requeridos",
      ]);
    }
    const product = await productsService.create({
      tenantId,
      name,
      taxId,
      description,
      categoryId,
      type,
      unitType,
      sku,
      barcode,
      costPrice: costPrice != null ? Number(costPrice) : undefined,
      salePrice: salePrice != null ? Number(salePrice) : undefined,
      trackStock: trackStock != null ? Boolean(trackStock) : undefined,
      allowDecimalInventory:
        allowDecimalInventory != null ? Boolean(allowDecimalInventory) : undefined,
      expiresAt: parseBodyExpiresAt(expiresAt),
      imageUrl,
      inventoryByLocation: Array.isArray(inventoryByLocation)
        ? inventoryByLocation.map((x: { locationId: string; quantity?: number }) => ({
            locationId: x.locationId,
            quantity: Number(x.quantity) || 0,
          }))
        : undefined,
    });
    if (!product) {
      return sendError(res, "Error al crear producto", ["Product not found"], 500);
    }
    sendSuccess<ProductApi>(res, "Creado correctamente", product, 201);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al crear producto";
    sendError(res, "Error al crear producto", [err], 500);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const {
      name,
      taxId,
      description,
      categoryId,
      type,
      unitType,
      sku,
      barcode,
      costPrice,
      salePrice,
      trackStock,
      allowDecimalInventory,
      expiresAt,
      archived,
      imageUrl,
      inventoryByLocation,
    } = req.body;
    const product = await productsService.update(req.params.id, {
      name,
      taxId,
      description,
      categoryId,
      type,
      unitType,
      sku,
      barcode,
      costPrice: costPrice != null ? Number(costPrice) : undefined,
      salePrice: salePrice != null ? Number(salePrice) : undefined,
      trackStock: trackStock != null ? Boolean(trackStock) : undefined,
      allowDecimalInventory:
        allowDecimalInventory != null ? Boolean(allowDecimalInventory) : undefined,
      expiresAt: parseBodyExpiresAt(expiresAt),
      archived: archived != null ? Boolean(archived) : undefined,
      imageUrl,
      inventoryByLocation: Array.isArray(inventoryByLocation)
        ? inventoryByLocation.map((x: { locationId: string; quantity?: number }) => ({
            locationId: x.locationId,
            quantity: Number(x.quantity) || 0,
          }))
        : undefined,
    });
    if (!product) {
      return sendError(res, "Error al actualizar producto", ["Product not found"], 500);
    }
    sendSuccess<ProductApi>(res, "Actualizado correctamente", product);
  } catch (e) {
    const err =
      e instanceof Error ? e.message : "Error al actualizar producto";
    sendError(res, "Error al actualizar producto", [err], 500);
  }
});

export const productsController = router;
