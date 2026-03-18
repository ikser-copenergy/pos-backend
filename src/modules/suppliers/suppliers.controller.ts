import { Router } from "express";
import { suppliersService } from "./suppliers.service";

const router = Router();

router.get("/", async (req, res) => {
  const tenantId = req.query.tenantId as string | undefined;
  const suppliers = await suppliersService.getAll(tenantId);
  res.json(suppliers);
});

router.get("/:id", async (req, res) => {
  const supplier = await suppliersService.getById(req.params.id);
  if (!supplier) return res.status(404).json({ error: "Supplier not found" });
  res.json(supplier);
});

export const suppliersController = router;
