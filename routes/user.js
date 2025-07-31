const express = require("express")
const router = express.Router()

const { registerValidationSchema,validateUserRegister } = require("../middlewares/validateRegister")
const { loginValidationSchema, validateUserLogin } = require("../middlewares/validateLogin")

const {register, login} =require("../controllers/user")

router.post("/register",registerValidationSchema,validateUserRegister, register);
router.post("/login",loginValidationSchema,validateUserLogin, login);

module.exports= router