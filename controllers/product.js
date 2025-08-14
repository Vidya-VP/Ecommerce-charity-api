const mongoose = require("mongoose");
const Product = require("../models/product");
const { uploadToCloudinary } = require("../utils/cloudinary");

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

//Post method
const createProduct = async (req, res) => {
  try {
    const {
      title,
      short_description,
      long_description,
      charity_id,
      category_id,
      quantity,
      price,
      discount,
      status
    } = req.body;

    if (req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({
        status: "Failed",
        message: "Only admin and super admin can create a product"
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        status: "Failed",
        message: "Product image is required"
      });
    }

    const imageURL = await uploadToCloudinary(req.file.buffer);

    const newProduct = {
      title,
      short_description,
      long_description,
      user_id: req.user._id,
      charity_id,
      category_id,
      quantity,
      price,
      discount: discount || 0,
      status: status || "pending",
      image: imageURL
    };

    const data = await Product.create(newProduct);
    return res.status(201).json({
      status: "Success",
      message: "Product created successfully",
      data
    });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      message: err.message
    });
  }
};

//PUT METHOD
const updateProduct = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: "Failed", 
        message: "Invalid Product ID" 
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        status: "Failed", 
        message: "Product not found" 
      });
    }

    if (req.user.role !== "super_admin" && product.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        status: "Failed", 
        message: "Not authorized" 
      });
    }

    if (req.file && req.file.buffer) {
      req.body.image = await uploadToCloudinary(req.file.buffer);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({
      status: "Success",
      message: "Product updated successfully",
      data: updatedProduct
    });
  } catch (err) {
    return res.status(500).json({ 
      status: "Failed", 
      message: err.message });
  }
};

//PATCH METHOD
const patchProductStatus = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        status: "Failed", 
        message: "Invalid Product ID" 
      });
    }

    const { status } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        status: "Failed", 
        message: "Product not found" 
      });
    }

    if (req.user.role !== "super_admin" && product.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        status: "Failed", 
        message: "Not authorized" 
      });
    }

    product.status = status;
    await product.save();

    return res.status(200).json({
      status: "Success",
      message: "Product status updated",
      data: product
    });
  } catch (err) {
    return res.status(500).json({ 
      status: "Failed", 
      message: err.message 
    });
  }
};







//get method using charity id
const getProductsByCharity = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        status: "Failed", 
        message: "Invalid Charity ID" 
      });
    }

    const products = await Product.find({ charity_id: id });
    return res.status(200).json({
      status: "Success",
      data: products
    });
  } catch (err) {
    return res.status(500).json({ 
      status: "Failed", 
      message: err.message 
    });
  }
};

// Get method using category id
const getProductsByCategory = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();

    if (!isValidObjectId(id)) {
      return res.status(400).json({
         status: "Failed", 
         message: "Invalid Category ID" 
        });
    }

    const products = await Product.find({ category_id: id });
    return res.status(200).json({
      status: "Success",
      data: products
    });
  } catch (err) {
    return res.status(500).json({ 
      status: "Failed", 
      message: err.message 
    });
  }
};

// Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      status: "Success",
      data: products
    });
  } catch (err) {
    return res.status(500).json({ 
      status: "Failed", 
      message: err.message 
    });
  }
};

// Get Product by ID
const getProductById = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();

    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        status: "Failed", 
        message: "Invalid Product ID" 
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        status: "Failed", 
        message: "Product not found" 
      });
    }

    return res.status(200).json({
      status: "Success",
      data: product
    });
  } catch (err) {
    return res.status(500).json({ 
      status: "Failed", 
      message: err.message 
    });
  }
};

module.exports = {createProduct,updateProduct,patchProductStatus,getProductsByCharity,getProductsByCategory,getAllProducts,getProductById};
