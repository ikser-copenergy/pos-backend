import { Router } from "express";
import { productsService } from "./products.service";

const router = Router();

router.get("/", async (req, res) => {
  const tenantId = req.query.tenantId as string | undefined;
  const products = await productsService.getAll(tenantId);
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await productsService.getById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

export const productsController = router;
