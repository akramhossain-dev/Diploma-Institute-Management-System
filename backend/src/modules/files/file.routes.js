import { Router } from "express";
import fileController from "./file.controller.js";
import uploadMiddleware from "../upload/upload.middleware.js";
import authenticate from "../../middlewares/authenticate.js";
import authorizeEntity from "../../middlewares/authorizeEntity.js";

const router = Router();

router.use(authenticate, authorizeEntity("admin"));

router.get("/", fileController.getFiles);

router.post(
  "/upload",
  uploadMiddleware.single("file"),
  fileController.uploadFile
);

router.delete("/:id", fileController.deleteFile);

export default router;
