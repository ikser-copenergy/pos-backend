import { Router } from "express";
import { salesService } from "./sales.service";

const router = Router();

router.get("/", async (req, res) => {
  const tenantId = req.query.tenantId as string | undefined;
  const sales = await salesService.getAll(tenantId);
  res.json(sales);
});

router.get("/:id", async (req, res) => {
  const sale = await salesService.getById(req.params.id);
  if (!sale) return res.status(404).json({ error: "Sale not found" });
  res.json(sale);
});

export const salesController = router;
