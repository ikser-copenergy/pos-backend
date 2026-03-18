import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { CategoryApi } from "../../shared/apiTypes";
import { categoriesService } from "./categories.service";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tenantId = req.query.tenantId as string | undefined;
    const categories = await categoriesService.getAll(tenantId);
    sendSuccess<CategoryApi[]>(res, "Listado correctamente", categories);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al listar categorías";
    sendError(res, "Error al obtener categorías", [err], 500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await categoriesService.getById(req.params.id);
    if (!category) {
      return sendError(res, "Categoría no encontrada", [
        "Category not found",
      ], 404);
    }
    sendSuccess<CategoryApi>(res, "Obtenido correctamente", category);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener categoría";
    sendError(res, "Error al obtener categoría", [err], 500);
  }
});

router.post("/", async (req, res) => {
  try {
    const { tenantId, name, parentId } = req.body;
    if (!tenantId || !name) {
      return sendError(res, "Datos incompletos", [
        "tenantId y name son requeridos",
      ]);
    }
    const category = await categoriesService.create({
      tenantId,
      name,
      parentId,
    });
    sendSuccess<CategoryApi>(res, "Creado correctamente", category, 201);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al crear categoría";
    sendError(res, "Error al crear categoría", [err], 500);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const category = await categoriesService.update(req.params.id, {
      name,
      parentId,
    });
    sendSuccess<CategoryApi>(res, "Actualizado correctamente", category);
  } catch (e) {
    const err =
      e instanceof Error ? e.message : "Error al actualizar categoría";
    sendError(res, "Error al actualizar categoría", [err], 500);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await categoriesService.delete(req.params.id);
    sendSuccess<null>(res, "Eliminado correctamente", null);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al eliminar categoría";
    sendError(res, "Error al eliminar categoría", [err], 500);
  }
});

export const categoriesController = router;
