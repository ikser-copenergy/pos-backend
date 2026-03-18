import { Router } from "express";
import { inventoryService } from "./inventory.service";

const router = Router();

router.get("/", async (req, res) => {
  const tenantId = req.query.tenantId as string | undefined;
  const inventory = await inventoryService.getAll(tenantId);
  res.json(inventory);
});

router.get("/:id", async (req, res) => {
  const item = await inventoryService.getById(req.params.id);
  if (!item) return res.status(404).json({ error: "Inventory item not found" });
  res.json(item);
});

export const inventoryController = router;
