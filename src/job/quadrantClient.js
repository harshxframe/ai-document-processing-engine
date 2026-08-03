import { QdrantClient } from "@qdrant/js-client-rest";

export const Quadclient = new QdrantClient({ host: "localhost", port: 6333 });
