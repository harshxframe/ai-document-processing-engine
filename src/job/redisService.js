import { redisClient } from "./redisClient.js";

export async function addInDB(id, status) {
  const isOk = await redisClient.set(id, status);
  if (isOk == "OK") {
    return true;
  }
  return false;
}

export async function changeStatus(id, status) {
  await redisClient.set(id, status);
} 


export async function  getStatus(id) {
  const data = await redisClient.get(id);
  if(data){
    return data;
  }
  return false;
}