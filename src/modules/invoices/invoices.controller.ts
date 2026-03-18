import { Router } from "express";
import { invoicesService } from "./invoices.service";

const router = Router();

router.get("/", async (req, res) => {
  const tenantId = req.query.tenantId as string | undefined;
  const invoices = await invoicesService.getAll(tenantId);
  res.json(invoices);
});

router.get("/:id", async (req, res) => {
  const invoice = await invoicesService.getById(req.params.id);
  if (!invoice) return res.status(404).json({ error: "Invoice not found" });
  res.json(invoice);
});

export const invoicesController = router;
