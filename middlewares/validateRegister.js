const { body, validationResult } = require("express-validator")

const registerValidationSchema = [
    body("name")
        .matches(/^[A-Za-z\s]+$/)
        .withMessage("Name should contain only alphabets and spaces"),

    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email should be valid"),

    body("mobile")
        .notEmpty().withMessage("Mobile number is required")
        .isNumeric().withMessage("Mobile number must contain only digits")
        .isLength({ min: 10, max: 10 }).withMessage("Mobile number must be 10 digits"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ max: 12 }).withMessage("Password should not exceed 12 characaters")
        .isLength({ min: 6 }).withMessage("Password should contain atleast 6 characters")
        .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
        .withMessage("Password must contain at least 1 uppercase letter, 1 number, and 1 special character"),
]

function validateUserRegister(req, res, next) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        let err = result.array();
        return res.status(400).json({
            message: err[0].msg
        })
    } else {
        next()
    }
}

module.exports = { registerValidationSchema, validateUserRegister }