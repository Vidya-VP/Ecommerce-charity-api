const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express()
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")

require("dotenv").config();
const PORT  = process.env.PORT||3000
const url = process.env.MongoDB_URL

app.use(express.json());

function connectMongoDB(){
    try{

    mongoose.connect(url);
    console.log(" connected to mongoDB");
    }catch(err){
        console.log("Error to connect mongoDB");
    }
   
}

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/category",categoryRoutes)

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.listen(PORT,()=>{
    connectMongoDB()
console.log(`Server port number ${PORT}`);
})