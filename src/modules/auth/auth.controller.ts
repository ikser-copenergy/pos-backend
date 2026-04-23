import { Router } from "express";
import bcrypt from "bcrypt";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import { usersRepository } from "../users/users.repository";
import { signToken } from "../../lib/jwt";
import { requireAuth } from "../../middleware/auth";
import { upload } from "../../lib/upload";
import { prisma } from "../../lib/prisma";

const router = Router();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30) || "negocio";
}

function generateUniqueSubdomain(base: string): string {
  const slug = slugify(base);
  const suffix = Date.now().toString(36).slice(-6);
  return `${slug}-${suffix}`;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
    tenantName: string;
    tenantLogoUrl?: string | null;
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
        tenantLogoUrl: user.tenant.logoUrl ?? null,
      },
    });
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error en login";
    sendError(res, "Error en login", [err], 500);
  }
});

router.post("/register", upload.single("logo"), async (req, res) => {
  try {
    const userData =
      typeof req.body.user === "string" ? JSON.parse(req.body.user) : req.body.user;
    const tenantData =
      typeof req.body.tenant === "string" ? JSON.parse(req.body.tenant) : req.body.tenant;
    const firstName = userData?.firstName?.trim();
    const lastName = userData?.lastName?.trim();
    const phone = userData?.phone?.trim();
    if (!firstName || !lastName || !userData?.email?.trim() || !userData?.password) {
      return sendError(res, "Datos incompletos", [
        "Usuario: nombre, apellido, email y password son requeridos",
      ]);
    }
    if (!/^\d{8}$/.test(phone || "")) {
      return sendError(res, "Teléfono inválido", [
        "El teléfono debe tener 8 dígitos",
      ]);
    }
    if (!tenantData?.name?.trim()) {
      return sendError(res, "Datos incompletos", [
        "Negocio: name es requerido",
      ]);
    }

    const email = String(userData.email).trim().toLowerCase();
    const existingUser = await usersRepository.findByEmailGlobal(email);
    if (existingUser) {
      return sendError(res, "El correo ya está registrado", ["Email already in use"], 400);
    }

    const subdomain = generateUniqueSubdomain(tenantData.name.trim());
    const hashedPassword = await bcrypt.hash(String(userData.password), 10);

    const logoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: tenantData.name.trim(),
          subdomain,
          logoUrl,
          plan: "free",
          status: "active",
        },
      });

      await tx.location.create({
        data: {
          tenantId: tenant.id,
          name: "Principal",
          isMain: true,
        },
      });

      await tx.setting.create({
        data: {
          tenantId: tenant.id,
          key: "businessName",
          value: tenantData.name.trim(),
        },
      });

      const user = await tx.user.create({
        data: {
          tenantId: tenant.id,
          name: `${firstName} ${lastName}`,
          email,
          password: hashedPassword,
          phone: `+504${phone}`,
          role: "ADMIN",
        },
        include: { tenant: true },
      });

      return { user, tenant };
    });

    const token = signToken({
      userId: result.user.id,
      tenantId: result.user.tenantId,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
    });

    sendSuccess<LoginResponse>(res, "Cuenta creada correctamente", {
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        tenantId: result.user.tenantId,
        tenantName: result.user.tenant.name,
        tenantLogoUrl: result.tenant.logoUrl ?? null,
      },
    }, 201);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al crear cuenta";
    sendError(res, "Error al crear cuenta", [err], 500);
  }
});

interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string;
  tenantName: string;
  tenantLogoUrl?: string | null;
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
      tenantLogoUrl: user.tenant.logoUrl ?? null,
    });
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al obtener usuario";
    sendError(res, "Error al obtener usuario", [err], 500);
  }
});

export const authController = router;
