import { Router } from "express";
import { tenantsService } from "./tenants.service";

const router = Router();

router.get("/", async (_req, res) => {
  const tenants = await tenantsService.getAll();
  res.json(tenants);
});

router.get("/:id", async (req, res) => {
  const tenant = await tenantsService.getById(req.params.id);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  res.json(tenant);
});

export const tenantsController = router;
