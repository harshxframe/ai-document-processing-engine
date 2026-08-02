// upload.middleware.ts

import multer from "multer";
import { getUniqueId } from "../utils/idGenerator.js";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const documentId = getUniqueId;

    // Make it available to the next middleware/controller
    req.documentId = documentId;

    cb(null, `${documentId}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: (_, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  },
});