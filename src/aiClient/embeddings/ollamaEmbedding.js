import ollama from "ollama";

export async function embeddingProvider(input) {
  try {
    const single = await ollama.embed({
      model: "bge-m3 ",
      input,
    });
    return single.embeddings;
  } catch (e) {
    throw e;
  }
}

//embeddingProvider("Hello");
