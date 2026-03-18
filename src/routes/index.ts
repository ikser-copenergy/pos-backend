import { Router } from "express";
import { tenantsController } from "../modules/tenants";
import { usersController } from "../modules/users";
import { locationsController } from "../modules/locations";
import { categoriesController } from "../modules/categories";
import { productsController } from "../modules/products";
import { inventoryController } from "../modules/inventory";
import { customersController } from "../modules/customers";
import { suppliersController } from "../modules/suppliers";
import { salesController } from "../modules/sales";
import { purchasesController } from "../modules/purchases";
import { invoicesController } from "../modules/invoices";

const router = Router();

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

export { router as apiRoutes };
