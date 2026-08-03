import { embeddingProvider } from "../embeddings/ollamaEmbedding.js";
import { Quadclient } from "../../job/quadrantClient.js";
import { aiChat } from "../ai.js";
import { systemPrompt } from "../../utils/systemprompt.js";

export async function runChat(id, chat, query) {
  console.log("Hello");
  id = "7d2e76bd-c4e1-4cb2-8f77-7db65e71bf5e";
  const [queryEmbedding] = await embeddingProvider(["What happned in this"]);
  if (queryEmbedding.length <= 0) {
    throw new Error("Query not valid");
  }

  const results = await Quadclient.query("ai_document_proccessed", {
    query: queryEmbedding,
    limit: 5,

    filter: {
      must: [
        {
          key: "documentId",
          match: {
            value: id,
          },
        },
      ],
    },

    with_payload: true,
  });
  // console.log(results.points)
  const data = results.points.map((item, index) => {
    return {
      text: item.payload?.text,
      pageReference: item.payload?.page,
    };
  });

  const buildSystemPrompt = systemPrompt(data);
  console.log(buildSystemPrompt);

  const aiResponse = await aiChat(buildSystemPrompt, chat);
  if (!aiResponse) {
    return null;
  }
  return aiResponse;
}

