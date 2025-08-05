
const express = require("express")
const router = express.Router()
const {authenticateUser} = require("../middlewares/Auth")
const {uploadFile} = require("../middlewares/multer")
const {charityValidationSchema,validateCharity } =  require("../middlewares/validateCharity") 
const { createCharity,getAllCharities, getCharitiesOfAdmin } =  require("../controllers/charity")

router.post(
  "/",
  uploadFile("banner"),          
  authenticateUser,                 
  charityValidationSchema,        
  validateCharity,                  
  createCharity                     
);

router.get("/",getAllCharities)
router.get("/admin",authenticateUser,getCharitiesOfAdmin)

module.exports = router
