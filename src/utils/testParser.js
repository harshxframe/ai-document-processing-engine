import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import { cleanPageText } from "./cleanPageText.js";
import { chunkText } from "./chunkText.js";
import { textEmbedding } from "../aiClient/vectorDb.js/vectroDb.js";
import { UPLOAD_DIR } from "./pathResolver.js";
import path from "path";

export async function textParserOP(fileId) {
  var parser;
  try {
    const filePath = path.join(UPLOAD_DIR, `${fileId}.pdf`);
    if (!fs.access(filePath)) {
      throw new Error("File does't exsit");
    }

    const buffer = await fs.readFile(filePath);
    parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    const pages = result.pages.map((page) => ({
      page: page.num,
      text: cleanPageText(page.text),
    }));
    const chunks = chunkText(pages, 1000, 200);
    return chunks;
  } catch (e) {
    throw e;
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}

//textParser("e7ccb32c-dd5e-45a3-bd85-43906ab97c28");


//textEmbedding(" ", "92839f96-8381-47aa-bf00-f45ba33ff303");