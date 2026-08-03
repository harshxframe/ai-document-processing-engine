import { aiChat } from "../aiClient/ai.js";
import { runChat } from "../aiClient/retrival/retrivalDb.js";
import { getStatus } from "../job/redisService.js";
import { resfrmt } from "../utils/resfrmt.js";

export const chatController = async (req, res) => {
  try {
    const { jobId, chat = [] } = req.body || {};

    if (!jobId) {
      return res.status(400).send(resfrmt(true, 400, "JobId not found", {}));
    }

    const jobStatus = await getStatus(jobId);
    if (!jobStatus) {
      return res.status(400).send(resfrmt(true, 400, "JobId not valid", {}));
    }

    if (jobStatus != "completed") {
      return res
        .status(200)
        .send(resfrmt(false, 200, "Your job current status", {}));
    }

    if (jobStatus === "completed") {
      if (chat.length <= 0) {
        return res
          .status(400)
          .send(resfrmt(true, 400, "Chat list not valid", {}));
      }
      const chatList = JSON.parse(chat).splice(-7);


      //Run retrival pipeline
const lastMessage = chat.at(-1); 
const content = lastMessage ? lastMessage.content : "";
      const aiResponse = await runChat(
        jobId,
        chatList,
        content,
      );
      if (aiResponse) {
        return res.status(200).send(
          resfrmt(false, 200, "Response generated successfully", {
            response: aiResponse,
          }),
        );
      } else {
        throw new Error("Failed to generate ai response");
      }
    }

    throw new Error("Somewent wrong");
  } catch (e) {
    return res.status(500).send(resfrmt(true, 500, e.message, {}));
  }
};
