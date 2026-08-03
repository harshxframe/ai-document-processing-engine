import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = process.env.BASE_URL;
const apiKey = process.env.AI_API_KEY;


const client = new OpenAI({
  baseURL: baseUrl,
  apiKey: apiKey,
});



 export async function aiChat(systemprompt, chatList) {

  const messageArray = [];
  messageArray.push({ "role": "system", "content": systemprompt });
  messageArray.push(...chatList);

  const completion = await client.chat.completions.create({
    messages: messageArray,
    model: "deepseek-v4-flash",
    thinking: {"type": "disabled"},
    reasoning_effort: "high",
    stream: false,
  });

  const response = completion.choices[0].message.content;
  if(response){
    return response;
  }
  return null;
}
