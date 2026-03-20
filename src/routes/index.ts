import { Router } from "express";
import { authController } from "../modules/auth/auth.controller";
import { tenantsController } from "../modules/tenants";
import { usersController } from "../modules/users";
import { locationsController } from "../modules/locations";
import { categoriesController } from "../modules/categories";
import { productsController } from "../modules/products";
import { uploadsController } from "../modules/uploads/uploads.controller";
import { inventoryController } from "../modules/inventory";
import { customersController } from "../modules/customers";
import { suppliersController } from "../modules/suppliers";
import { salesController } from "../modules/sales";
import { purchasesController } from "../modules/purchases";
import { invoicesController } from "../modules/invoices";
import { settingsController } from "../modules/settings";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use("/auth", authController);

router.use(requireAuth);

router.use("/uploads", uploadsController);
router.use("/tenants", tenantsController);
router.use("/users", usersController);
router.use("/locations", locationsController);
router.use("/categories", categoriesController);
router.use("/products", productsController);
router.use("/inventory", inventoryController);
router.use("/customers", customersController);
router.use("/suppliers", suppliersController);
router.use("/sales", salesController);
router.use("/purchases", purchasesController);
router.use("/invoices", invoicesController);
router.use("/settings", settingsController);

export { router as apiRoutes };
