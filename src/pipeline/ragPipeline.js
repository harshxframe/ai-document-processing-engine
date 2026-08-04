import { textEmbedding } from "../aiClient/vectorDb.js/vectroDb.js";
import { changeStatus } from "../job/redisService.js";
import { cleanupFile } from "../utils/filecleanup.js";
import { textParserOP } from "../utils/testParser.js";

export async function embbedPipeline(job) {
  const jobID = job.id;
  const documentID = job.data?.id;
  const currentAttempt = job.attemptsMade + 1;
  const maxAttempts = job.opts.attempts;

  try {
    if (!jobID) {
      throw new Error("Missing job ID");
    }

    await changeStatus(documentID, "prosessing");
    const textChunks = await textEmbedding(documentID);

    if (textChunks) {
      await changeStatus(documentID, "completed");
      return;
    }
    await changeStatus(documentID, "Failed");
    throw new Error("RAG pipeline failed");
  } catch (e) {
    await changeStatus(documentID, "Failed");
    throw e;
  } finally {
    // If maxAttempts is 3, this triggers on the 3rd and final run
    if (currentAttempt === maxAttempts) {
      await cleanupFile(documentID);
    }
  }
}
