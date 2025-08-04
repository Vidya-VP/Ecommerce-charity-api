const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middlewares/Auth");
const { uploadImage } = require("../middlewares/multer");
const { categoryValidationSchema, validateCategory } = require("../middlewares/validateCategory");
const { createCategory,getAllCategories,getAdminCategories,updateCategoryTitle } = require("../controllers/category");


router.post( "/", authenticateUser, uploadImage, categoryValidationSchema, validateCategory, createCategory);

router.get("/", getAllCategories);

router.get("/admin", authenticateUser, getAdminCategories);

router.patch("/:id", authenticateUser, categoryValidationSchema, validateCategory, updateCategoryTitle);

module.exports = router;

