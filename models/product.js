const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required:true,
    match: [/^[A-Za-z\s]+$/, "Title must contain alphabets only"]
  },
  short_description: {
    type: String,
    required:true,
    min: 10,
    max:15,
  },
  long_description: {
    type: String,
    required: true,
    min: 20,
    max: 50,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User"
  },
  charity_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Charity"
  },
  category_id: {
    type: mongoose.Types.ObjectId,
    required:true, 
    ref: "Category"
  },
  quantity: {
    type: Number,
    required: true, 
    min:25, 
    max:50, 
  },
  price: {
    type: Number,
    required: [true, "Price is required"]
  },
  discount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ["pending", "active", "sold", "inactive"],
    default: "pending"
  },
  image: {
    type: String,
    required:true, 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Product", productSchema);


