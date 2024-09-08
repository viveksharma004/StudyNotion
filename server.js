const express=require("express");
const app=express();

app.use(express.json());
require("dotenv").config();

app.listen(3000,()=>{
    console.log("server started at 3000");
})

app.get("/",(req,res)=>{
    res.send("This is the server ")
})