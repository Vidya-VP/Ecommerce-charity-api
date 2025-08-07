const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/user")
const jwt_key = process.env.JWT_SECRETE_KEY

async function authenticateUser(req,res,next){
    try{
        let token = req.headers["authorization"].split(" ")[1]
        if(!token){
            return res.status(401).json({
                status: "Failed",
                message:"Unauthorized user"
            })
        }
        let decoded = await jwt.verify(token,jwt_key)
        const user = await User.findById(decoded.user_id); 
        if (!user) {
            return res.status(401).json({
                status: "Failed",
                message: "User not found"
            });
        }
        req.user = user;
        next();
    }catch(err){
        return res.status(500).json({
            status:"Failed",
            message:"Authentication failed"
        })
    }  
}

module.exports = { authenticateUser }