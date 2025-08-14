const { body, validationResult } = require("express-validator");

const productValidationSchema = [
    body("title")
        .notEmpty().withMessage("Title is required")
        .isString().withMessage("Title must be a string")
        .matches(/^[A-Za-z\s]+$/).withMessage("Title should contain alphabets and spaces only"),

    body("short_description")
        .notEmpty().withMessage("Short description is required")
        .isLength({min:10,max:15}).withMessage("Short description must be between 10 and 15 characters"),

    body("long_description")
        .notEmpty().withMessage("Long description is required")
        .isLength({min:20,max:50 }).withMessage("Long description must be between 20 and 50 characters"),

    body("charity_id").notEmpty().withMessage("Charity ID is required"),

    body("category_id").notEmpty().withMessage("Category ID is required"),

    body("quantity")
        .notEmpty().withMessage("Quantity is required")
        .isInt({min:25,max:50}).withMessage("Quantity must be between 25 and 50"),

    body("price")
        .notEmpty().withMessage("Price is required")
        .isFloat({gt:0}).withMessage("Price must be greater than 0"),

    body("discount")
        .optional()
        .isFloat({ min: 0 }).withMessage("Discount must be a positive number"),

    body("status")
        .optional()
        .isIn(["pending", "active", "sold", "inactive"]).withMessage("Invalid status value")
];

function validateProduct(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = errors.array();
        return res.status(400).json({
            message: err[0].msg
        });
    }
    next();
}

module.exports = { productValidationSchema, validateProduct };
