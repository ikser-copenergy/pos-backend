import { Router } from "express";
import { purchasesService } from "./purchases.service";

const router = Router();

router.get("/", async (req, res) => {
  const tenantId = req.query.tenantId as string | undefined;
  const purchases = await purchasesService.getAll(tenantId);
  res.json(purchases);
});

router.get("/:id", async (req, res) => {
  const purchase = await purchasesService.getById(req.params.id);
  if (!purchase) return res.status(404).json({ error: "Purchase not found" });
  res.json(purchase);
});

export const purchasesController = router;
