const express = require("express");
const router = express.Router();
const {uploadFile} = require("../middlewares/multer")
const { uploadToCloudinary } = require("../utils/cloudinary"); // Your multer wrapper
const { authenticateUser,authorizeRoles} = require("../middlewares/Auth");
const { productValidationSchema, validateProduct } = require("../middlewares/validateProduct");

const {createProduct,updateProduct,patchProductStatus,getProductsByCharity,getProductsByCategory,getAllProducts,getProductById} = require("../controllers/product");

router.post("/",authenticateUser,uploadFile("banner"), productValidationSchema,validateProduct,createProduct);

router.put("/:id",authenticateUser,uploadFile("banner"), productValidationSchema,validateProduct,updateProduct);


router.patch("/:id",authenticateUser,patchProductStatus);


router.get("/admin/charity/:id",authenticateUser,authorizeRoles("admin", "super_admin"), getProductsByCharity);


router.get("/charity/:id", getProductsByCharity);

router.get("/category/:id", getProductsByCategory);


router.get("/", getAllProducts);


router.get("/:id", getProductById);

module.exports = router;
