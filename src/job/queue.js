import { Queue } from "bullmq";
import { redisClient } from "./redisClient.js";

export const AIQueue = new Queue("document-queue", {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
});

