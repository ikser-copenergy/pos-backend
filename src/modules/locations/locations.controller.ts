import { Router } from "express";
import { locationsService } from "./locations.service";

const router = Router();

router.get("/", async (req, res) => {
  const tenantId = req.query.tenantId as string | undefined;
  const locations = await locationsService.getAll(tenantId);
  res.json(locations);
});

router.get("/:id", async (req, res) => {
  const location = await locationsService.getById(req.params.id);
  if (!location) return res.status(404).json({ error: "Location not found" });
  res.json(location);
});

export const locationsController = router;
