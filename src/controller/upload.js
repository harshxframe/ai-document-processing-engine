import { AIQueue } from "../job/queue.js";
import { addInDB } from "../job/redisService.js";
import { resfrmt } from "../utils/resfrmt.js";

export const uploadController = async (req, res) => {
  try {
    const documentID = req.documentId;
    const file = req.file;

    // Add in redis and add in queue
    const isOK = await addInDB(documentID, "Queued");
    if (!isOK) {
      res.status(500).send(resfrmt(true, 500, "Failed to register", {}));
    }
    const inQueue = await AIQueue.add("document-queue", { id: documentID });
    if (!inQueue?.id) {
      res.status(500).send(resfrmt(true, 500, "Failed to queue", {}));
    }
    res.send(inQueue?.id);
  } catch (e) {
    res.status(500).send(resfrmt(true, 500, e.message, {}));
  }
};

export const chat = async (req, res) => {};
