// tester.js

import fs from "fs";
import path from "path";

const BASE_URL = "http://localhost:2020/app";

const FILE_PATH ="/Users/harsh/Downloads/Frater_U_D_Practical_Sigil_Magic.pdf"; // <-- Change this

let jobId = null;
let chatHistory = [];

async function upload() {
  console.log("\n📄 Uploading document...");

  const form = new FormData();

  const file = new Blob([fs.readFileSync(FILE_PATH)], {
    type: "application/pdf",
  });

  form.append("file", file, path.basename(FILE_PATH));

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: form,
  });

  const json = await res.json();

  if (json.error) throw new Error(json.message);

  jobId = json.data.jobId;

  console.log("✅ Uploaded");
  console.log("Job:", jobId);
}

async function waitUntilCompleted() {
  console.log("\n⏳ Waiting for processing...");

  while (true) {
    chatHistory = [
      {
        role: "user",
        content: "status",
      },
    ];

    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId,
        chat: JSON.stringify(chatHistory),
      }),
    });

    const json = await res.json();

    if (json.message === "Response generated successfully") {
      console.log("✅ Processing completed");
      return;
    }

    console.log("⌛ Still processing...");

    await new Promise((r) => setTimeout(r, 2000));
  }
}

async function chatLoop() {
  console.log("\n🤖 Chat Ready!");
  console.log("Type 'exit' to quit.\n");

  process.stdin.setEncoding("utf8");

  process.stdout.write("You > ");

  process.stdin.on("data", async (input) => {
    const question = input.trim();

    if (question.toLowerCase() === "exit") {
      process.exit(0);
    }

    chatHistory.push({
      role: "user",
      content: question,
    });

    const res = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jobId,
        chat: JSON.stringify(chatHistory),
      }),
    });

    const json = await res.json();

    const answer = json.data.response;

    console.log("\nAssistant >");
    console.log(answer);
    console.log();

    chatHistory.push({
      role: "assistant",
      content: answer,
    });

    process.stdout.write("You > ");
  });
}

(async () => {
  try {
    console.log("=================================");
    console.log(" AI Document Processing Engine");
    console.log("=================================");

    console.log("\nFile:");
    console.log(FILE_PATH);

    await upload();

    await waitUntilCompleted();

    await chatLoop();
  } catch (e) {
    console.error(e);
  }
})();


