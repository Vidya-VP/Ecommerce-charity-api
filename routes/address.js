const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/Auth");
const { createAddress, getAddress, updateAddress, deleteAddress } = require("../controllers/address");
const { addressValidationSchema, validateAddress } = require("../middlewares/validateAddress"); 

router.post("/", authenticateUser, addressValidationSchema, validateAddress, createAddress);

router.get("/", authenticateUser, getAddress);

router.put("/:id", authenticateUser, addressValidationSchema, validateAddress, updateAddress);

router.delete("/:id", authenticateUser, deleteAddress);

module.exports = router;
