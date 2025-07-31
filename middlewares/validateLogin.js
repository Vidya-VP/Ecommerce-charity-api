const { body, validationResult } = require("express-validator")

const loginValidationSchema = [
    body("userId")
        .notEmpty().withMessage("Email or mobile is required")
        .custom((value) => {
            const isEmail = /\S+@\S+\.\S+/.test(value);
            const isMobile = /^[0-9]{10}$/.test(value);
            if (!isEmail && !isMobile) {
                throw new Error("Must be a valid email or 10-digit mobile number");
            }
            return true;
        }),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ max: 12 }).withMessage("Password should not exceed 12 characaters")
        .isLength({ min: 6 }).withMessage("Password should contain atleast 6 characters")
]

function validateUserLogin(req,res,next){
    const result = validationResult(req)
    if(!result.isEmpty()){
        let err = result.array();
        return res.status(400).json({
            message: err[0].msg
        })
    }else{
        next()
    }
}

module.exports= { loginValidationSchema, validateUserLogin }
