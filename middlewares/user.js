const { body, validationResult } = require("express-validator");

const validateSchema = [
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid Email"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .isLength({ max: 12 }).withMessage("Password must be at most 12 characters")
        .isAlphanumeric().withMessage("Password should contain only letters and numbers"),
];

function validateUserSchema(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        const errors = result.array();
        return res.status(400).json({
            status:"failed",
            message: errors[0].msg, 
        }); 
    } else {
        next();
    }
}

module.exports = { validateSchema, validateUserSchema};
