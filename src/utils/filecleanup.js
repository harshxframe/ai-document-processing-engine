import fs from "fs/promises";
import path from "path";
import { UPLOAD_DIR } from "./pathResolver.js";

export async function cleanupFile(fileId) {
  try {
    const filePath = path.join(UPLOAD_DIR, `${fileId}.pdf`);
   
console.log(filePath);
    await fs.unlink(filePath);

    return true;
  } catch (error) {
    // Ignore if file doesn't exist
    if (error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}
