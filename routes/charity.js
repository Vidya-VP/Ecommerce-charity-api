
const express = require("express")
const router = express.Router()
const {authenticateUser} = require("../middlewares/Auth")
const {uploadFile} = require("../middlewares/multer")
const {charityValidationSchema,validateCharity } =  require("../middlewares/validateCharity") 
const { createCharity,getAllCharities, getCharitiesOfAdmin,getCharityById ,getCharityByIdForAdmin,updateCharity } =  require("../controllers/charity")

router.post( "/", uploadFile("banner"),authenticateUser,charityValidationSchema,validateCharity,createCharity);

router.get("/",getAllCharities)

router.get("/admin",authenticateUser,getCharitiesOfAdmin)

router.get("/:id", getCharityById);

router.get("/admin/:id", authenticateUser, getCharityByIdForAdmin);

router.put("/:id",uploadFile("banner"),authenticateUser,charityValidationSchema,validateCharity,updateCharity);


module.exports = router
