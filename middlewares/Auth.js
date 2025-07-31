const jwt = require("jsonwebtoken")
require("dotenv").config()

const jwt_key =process.env.JWT_SECRETE_KEY
async function authenticateUser(req,res,next){
    try{
        let token = req.headers["authorization"].split(" ")[1]
        let decoded = await jwt.verify(token,jwt_key)
        console.log(decoded);
        req.user_id = decoded.user_id;
        next();

    }catch(err){
        return res.status(500).json({
            status:"Failed",
            message:"Authentication failed"
        })
    }
}

module.exports = {authenticateUser}