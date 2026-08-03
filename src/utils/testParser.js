import fs from "fs/promises";
import { PDFParse } from "pdf-parse";
import { cleanPageText } from "./cleanPageText.js";
import { chunkText } from "./chunkText.js";

export async function textParser(filePath) {
  var parser;
  try {
    const path = `../../uploads/${filePath}.pdf`;
    if (!fs.access(path)) {
      throw new Error("File does't exsit");
    }

    const buffer = await fs.readFile(path);
    parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    const pages = result.pages.map((page) => ({
      page: page.num,
      text: cleanPageText(page.text),
    }));
    const chunks = chunkText(pages, 1000, 200);
    console.log(chunks);
    return chunks;
  } catch (e) {
    throw e;
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
}

textParser("e7ccb32c-dd5e-45a3-bd85-43906ab97c28");
