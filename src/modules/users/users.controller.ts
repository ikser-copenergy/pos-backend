import { Router } from "express";
import { usersService } from "./users.service";

const router = Router();

router.get("/", async (req, res) => {
  const tenantId = req.query.tenantId as string | undefined;
  const users = await usersService.getAll(tenantId);
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await usersService.getById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

export const usersController = router;
