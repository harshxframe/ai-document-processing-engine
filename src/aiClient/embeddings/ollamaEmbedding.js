import ollama from "ollama";

export async function embeddingProvider(chunk) {
  const single = await ollama.embed({
    model: "bge-m3 ",
    input: chunk,
  });
  console.log(single);
  return single.embeddings;
}


//embeddingProvider("Hello");


