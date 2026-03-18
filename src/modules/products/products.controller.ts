import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { ProductApi } from "../../shared/apiTypes";
import { productsService } from "./products.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const products = await productsService.getAll(tenantId);
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
    sendSuccess(res, "Obtenido correctamente", product);
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
      description,
      categoryId,
      type,
      unitType,
      sku,
      barcode,
      costPrice,
      salePrice,
      trackStock,
      imageUrl,
    } = req.body;
    if (!tenantId || !name || !type) {
      return sendError(res, "Datos incompletos", [
        "tenantId, name y type son requeridos",
      ]);
    }
    const product = await productsService.create({
      tenantId,
      name,
      description,
      categoryId,
      type,
      unitType,
      sku,
      barcode,
      costPrice: costPrice != null ? Number(costPrice) : undefined,
      salePrice: salePrice != null ? Number(salePrice) : undefined,
      trackStock: trackStock != null ? Boolean(trackStock) : undefined,
      imageUrl,
    });
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
      description,
      categoryId,
      type,
      unitType,
      sku,
      barcode,
      costPrice,
      salePrice,
      trackStock,
      imageUrl,
    } = req.body;
    const product = await productsService.update(req.params.id, {
      name,
      description,
      categoryId,
      type,
      unitType,
      sku,
      barcode,
      costPrice: costPrice != null ? Number(costPrice) : undefined,
      salePrice: salePrice != null ? Number(salePrice) : undefined,
      trackStock: trackStock != null ? Boolean(trackStock) : undefined,
      imageUrl,
    });
    sendSuccess<ProductApi>(res, "Actualizado correctamente", product);
  } catch (e) {
    const err =
      e instanceof Error ? e.message : "Error al actualizar producto";
    sendError(res, "Error al actualizar producto", [err], 500);
  }
});

export const productsController = router;
