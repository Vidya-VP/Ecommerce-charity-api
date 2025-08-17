const { body, validationResult } = require("express-validator");

const addressValidationSchema = [
  body("location")
    .notEmpty().withMessage("Location is required")
    .isString().withMessage("Location must be a string"),

  body("city")
    .notEmpty().withMessage("City is required")
    .isString().withMessage("City must be a string"),

  body("pincode")
    .notEmpty().withMessage("Pincode is required")
    .isNumeric().withMessage("Pincode must be a number")
    .matches(/^[1-9][0-9]{5}$/).withMessage("Invalid pincode format"),

  body("state")
    .notEmpty().withMessage("State is required")
    .isString().withMessage("State must be a string"),

  body("country")
    .optional()
    .isString().withMessage("Country must be a string")
    .default("India"),
];

function validateAddress(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let err = errors.array();
    return res.status(400).json({
      message: err[0].msg,
    });
  }
  next();
}

module.exports = { addressValidationSchema, validateAddress };
