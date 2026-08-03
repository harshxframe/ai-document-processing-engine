import { QdrantClient } from "@qdrant/js-client-rest";
import { textParserOP } from "../../utils/testParser.js";
import { embeddingProvider } from "../embeddings/ollamaEmbedding.js";
import { getUniqueId } from "../../utils/idGenerator.js";

const client = new QdrantClient({ host: "localhost", port: 6333 });

export async function textEmbedding(id) {
  try {
    console.time("totalTime");
    const chunks = await textParserOP(id);

    const collection = await client.getCollections();

    const exsit = collection.collections.some(
      (c) => c.name === "ai_document_proccessed",
    );

    if (!exsit) {
      await client.createCollection("ai_document_proccessed", {
        vectors: { size: 1024, distance: "Cosine" },
      });
    }

    const totalChunks = chunks.length;
    const batch = 100;
    const totalBatch = Math.ceil(totalChunks / batch);
    console.log("Chunks:" + totalChunks);
    console.log("Total batch:" + totalBatch);
    for (let i = 0; i < totalBatch; i++) {
      const batchm = chunks.slice(i * batch, (i + 1) * batch);
      const texts = batchm.map((item) => item.text);
      const embedding = await embeddingProvider(texts);

      const points = batchm.map((chunks, index) => ({
        id: getUniqueId(),
        vector: embedding[index],
        payload: {
          documentId:id,
          page: chunks.page,
          chunkIndex: chunks.chunkIndex,
          text: chunks.text,
        },
      }));
      const dbOperation = await client.upsert("ai_document_proccessed",{wait:true, points:points});
      if(dbOperation.status != "completed"){
        throw new Error("Failed to store in Db");
      }
      console.log(`Batch ${i} saved successfully`)
    }
    console.timeEnd("totalTime");
    return true;
  } catch (e) {
    throw e;
  }
}
