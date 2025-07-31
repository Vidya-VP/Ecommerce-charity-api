const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express()

require("dotenv").config();
const PORT  = process.env.PORT||3000
const url = process.env.MongoDB_URL

function connectMongoDB(){
    try{

    mongoose.connect(url);
    console.log(" connected to mongoDB");
    }catch(err){
        console.log("Error to connect mongoDB");
    }
   
}



app.get("/",(req,res)=>{
    res.send("Hello")
})

app.listen(PORT,()=>{
    connectMongoDB()
console.log(`Server port number ${PORT}`);
})