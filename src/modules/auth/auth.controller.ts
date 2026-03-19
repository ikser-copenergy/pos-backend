import { Router } from "express";
import bcrypt from "bcrypt";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import { usersRepository } from "../users/users.repository";
import { signToken } from "../../lib/jwt";
import { requireAuth } from "../../middleware/auth";

const router = Router();

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
    tenantName: string;
  };
}

router.post("/login", async (req, res) => {
  try {
    const { email, password, tenantSubdomain } = req.body;
    if (!email || !password) {
      return sendError(res, "Datos incompletos", ["email y password son requeridos"]);
    }

    const user = await usersRepository.findByEmailGlobal(email);
    if (!user) {
      return sendError(res, "Credenciales inválidas", ["Usuario no encontrado"], 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return sendError(res, "Credenciales inválidas", ["Contraseña incorrecta"], 401);
    }

    const token = signToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    sendSuccess<LoginResponse>(res, "Login exitoso", {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        tenantName: user.tenant.name,
      },
    });
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error en login";
    sendError(res, "Error en login", [err], 500);
  }
});

interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  tenantName: string;
}

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await usersRepository.findByIdWithTenant(req.user!.userId);
    if (!user) {
      return sendError(res, "Usuario no encontrado", ["User not found"], 404);
    }
    sendSuccess<MeResponse>(res, "Ok", {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      tenantName: user.tenant.name,
    });
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener usuario";
    sendError(res, "Error al obtener usuario", [err], 500);
  }
});

export const authController = router;
