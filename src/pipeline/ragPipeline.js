import { textEmbedding } from "../aiClient/vectorDb.js/vectroDb.js";
import { changeStatus } from "../job/redisService.js";
import { cleanupFile } from "../utils/filecleanup.js";
import { textParserOP } from "../utils/testParser.js";

export async function embbedPipeline(job) {
  try {
    const jobID = job.id;
    const documentID = job.data?.id;

    if (!jobID) {
      throw new Error("Missing job ID");
    }

    await changeStatus(documentID, "prosessing");
    const textChunks = await textEmbedding(documentID);

    if (textChunks) {
      await changeStatus(documentID, "completed");
      await cleanupFile(documentID);
      return;
    }

    await changeStatus(documentID, "Failed");
    throw new Error("RAG pipeline failed");
  } catch (e) {
    throw e;
  }
}
