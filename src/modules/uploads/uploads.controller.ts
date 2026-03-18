import { Router } from "express";
import { sendSuccess, sendError } from "../../shared/apiResponse";
import type { UploadResponse } from "../../shared/apiTypes";
import { upload } from "../../lib/upload";

const router = Router();

router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, "No se envió ninguna imagen", [
        "No image file provided",
      ]);
    }
    const url = `/uploads/${req.file.filename}`;
    sendSuccess<UploadResponse>(res, "Imagen subida correctamente", { url }, 201);
  } catch (e) {
    const err = e instanceof Error ? e.message : "Error al subir imagen";
    sendError(res, "Error al subir imagen", [err], 500);
  }
});

export const uploadsController = router;
