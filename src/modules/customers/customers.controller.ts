import { Router } from "express";
import { customersService } from "./customers.service";

const router = Router();

router.get("/", async (req, res) => {
  const tenantId = req.query.tenantId as string | undefined;
  const customers = await customersService.getAll(tenantId);
  res.json(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await customersService.getById(req.params.id);
  if (!customer) return res.status(404).json({ error: "Customer not found" });
  res.json(customer);
});

export const customersController = router;
