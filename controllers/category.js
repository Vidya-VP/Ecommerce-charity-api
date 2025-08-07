const Category = require("../models/category")

const { uploadToCloudinary } = require("../utils/cloudinary")


//POST METHOD
async function createCategory(req, res) {
  try {
    console.log(req.file);
    console.log(req.body);

    const { title } = req.body

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        status: "Failed",
        message: "Only admin and super admin can create a category"
      });
    }

    console.log(req.file);


    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        status: "Failed",
        message: "Image is required"
      })
    }

    const imageURL = await uploadToCloudinary(req.file.buffer)

    const newCategory = {
      title,
      image: imageURL,
      user_id: req.user._id
    }

    const data = await Category.create(newCategory)

    res.status(201).json({
      status: "Success",
      message: "Category created successfully",
      data: data
    })
  }
  catch (err) {
    return res.status(500).json({
      status: "Failed",
      message: err.message
    })
  }
}


//GET METHOD
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().select("-__v");
    res.status(200).json({
      success: true,
      count: categories.length, categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching categories"
    });
  }
};

//GET METHOD
const getAdminCategories = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;

    let categories;
    if (role === "super_admin") {
      categories = await Category.find();
    } else {
      categories = await Category.find({ user_id: userId });
    }

    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories for admin"
    });
  }
};

//PATCH METHOD
const updateCategoryTitle = async (req, res) => {
  try {
    const { categoryId, title } = req.body;
    const userId = req.user._id;
    const role = req.user.role;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }
    
    if (category.user_id.toString() !== userId.toString() && role !== "super_admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this category"
      });
    }

    category.title = title;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully", category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};

module.exports = { createCategory, getAllCategories, getAdminCategories, updateCategoryTitle };
