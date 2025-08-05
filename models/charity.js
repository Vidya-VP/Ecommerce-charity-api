const mongoose = require("mongoose")

const charitySchema = new mongoose.Schema({
    name :{
        type:String,
        required : true
    },
    description :{
        type:String,
        required : true
    },
    banner :{
        type: String,
        required : true
    },
    user_id :{
        type: mongoose.Types.ObjectId,
        ref : "User"
    },
    charity_email :{
        type: String,
        required: true
    },
    start_date: {
        type:String,
        required: true
    },
    end_date : {
        type: String,
        required : true
    },
    platform_fee: {
        type: Number,
        default : 10
    },
    donation_fee : {
        type: Number,
        default : 70
    },
    profit : {
        type: Number,
        default : 20
    },
    status : {
        type : String,
        enum : [ "pending", "approved" , "live" , "closed"]
    }
},{timestamps : true})

const Charity = mongoose.model("Charity",charitySchema)

module.exports = Charity