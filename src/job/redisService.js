import { redisClient } from "./redisClient.js";

export async function addInDB(id, status) {
  const isOk = await redisClient.set(id, status);
  if (isOk == "OK") {
    return true;
  }
  return false;
}
