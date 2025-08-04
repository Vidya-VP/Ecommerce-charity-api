const mongoose=require("mongoose")

const categorySchema=new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

const Category=mongoose.model("Category",categorySchema)
module.exports=Category

