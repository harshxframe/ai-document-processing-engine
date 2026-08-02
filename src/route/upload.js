import express from "express";
import { uploadController } from "../controller/upload.js";
import { upload } from "../middleware/upload.js";

const uploadRouter = express.Router();

uploadRouter.post("/upload", upload.single("file"), uploadController);

export default uploadRouter;
