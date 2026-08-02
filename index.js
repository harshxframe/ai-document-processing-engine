import express from "express";
import dotenv from "dotenv";
import uploadRouter from "./src/route/upload.js";
import { globalErrorHandle } from "./src/middleware/gloErrorHandle.js";

dotenv.config();

const PORT = process.env.PORT || 2020;

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());



app.use("/app", uploadRouter);
app.get("/health",(req,res)=>{
    res.send("Hello Harsh");
})

app.use(globalErrorHandle);

app.listen(PORT,()=>{
    console.log("Server sarted at port: "+PORT)
})