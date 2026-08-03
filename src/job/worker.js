import { Worker } from "bullmq";
import { embbedPipeline } from "../pipeline/ragPipeline.js";
import { redisClient } from "./redisClient.js";

let workerInstance = null; 

function embeddWorker() {
  try {
        
    workerInstance = new Worker("document-queue", embbedPipeline, {
      connection: redisClient,
      concurrency: 5,
      removeOnComplete:{
        count:0
      },
      removeOnFail:{
        count:0
      }
    });

    console.log("Worker initialized. Waiting for jobs...");

    workerInstance.on("completed", (job) => {
      console.log(`Job ${job.id} completed`);
    });

    workerInstance.on("failed", (job, err) => {
      console.error(`Job ${job.id} failed: ${err.message}`);
    });

    workerInstance.on("error", (err) => {
      console.error("Worker error:", err);
    });
    
    workerInstance.on("ready", () => {
        console.log("Worker is ready and listening!");
    });

    process.on("SIGTERM", async () => {
      console.log("Shutting down...");
      await workerInstance.close();
      process.exit(0);
    });

  } catch (e) {
    console.error("Error in starting Embedd worker:", e);
  }
}

embeddWorker();

setInterval(() => {}, 1000);    