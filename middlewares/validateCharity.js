const { body, validationResult } = require("express-validator");

const charityValidationSchema = [
    body("name")
        .notEmpty().withMessage("Name is required")
        .isAlpha().withMessage("Name should conatin alphabets only"),

    body("description")
        .notEmpty().withMessage("Description is required")
        .isLength({ max: 100 }).withMessage("Description should not exceed 100 characters.")
        .isLength({ min: 30 }).withMessage("Description should atleat contain 30 characters."),

    body("charity_email")
        .notEmpty().withMessage("Charity email is required")
        .isEmail().withMessage("Email should be valid")
        .custom((value) => {
            const personalDomains = [
                "gmail.com", "yahoo.com", "hotmail.com", "outlook.com",
                "rediffmail.com", "icloud.com", "aol.com"
            ];
            const domain = value.split("@")[1].toLowerCase();
            if (personalDomains.includes(domain)) {
                throw new Error("Charity email must be from an official organization domain, not a personal email provider");
            }
            return true;
        }),

    body("start_date")
        .notEmpty().withMessage("Start date is required")
        .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
        .withMessage("Start date must be in UTC format: YYYY-MM-DDTHH:mm:ssZ")
        .custom((value) => {
            const eventDate = new Date(value);
            const now = new Date();

            if (eventDate <= now) {
                throw new Error("Start date must be greater than the current date and time");
            }
            return true;
        }),

    body("end_date")
        .notEmpty().withMessage("End date is required")
        .matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
        .withMessage("Start date must be in UTC format: YYYY-MM-DDTHH:mm:ssZ")
        .custom((value, { req }) => {
            const endDate = new Date(value);
            const startDate = new Date(req.body.start_date);

            if (endDate <= startDate) {
                throw new Error("End date must be greater than start date");
            }
            return true;
        }),

    body("platform_fee")
        .default(10),

    body("donation_fee")
        .default(70),

    body("profit")
        .default(20)
]

function validateCharity(req, res, next) {
    const result = validationResult(req)
    if (!result.isEmpty()) {
        const err = result.array()
        return res.status(400).json({
            message: err[0].msg
        })
    } else {
        next();
    }
}

module.exports = { charityValidationSchema, validateCharity }