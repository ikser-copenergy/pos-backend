import { Router } from "express";
import { categoriesService } from "./categories.service";

const router = Router();

router.get("/", async (req, res) => {
  const tenantId = req.query.tenantId as string | undefined;
  const categories = await categoriesService.getAll(tenantId);
  res.json(categories);
});

router.get("/:id", async (req, res) => {
  const category = await categoriesService.getById(req.params.id);
  if (!category) return res.status(404).json({ error: "Category not found" });
  res.json(category);
});

export const categoriesController = router;
