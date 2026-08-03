import express from "express";
import dotenv from "dotenv";
import uploadRouter from "./route/upload.js";
import { globalErrorHandle } from "./middleware/gloErrorHandle.js";
import chatRouter from "./route/chat.js";

dotenv.config();

const PORT = process.env.PORT || 2020;

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.use("/app", uploadRouter);
app.use("/app", chatRouter);
app.get("/health",(req,res)=>{
    res.send("Hello Harsh");
})

app.use(globalErrorHandle);

app.listen(PORT,()=>{
    console.log("Server sarted at port: "+PORT)
})