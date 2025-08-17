const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // will be set from token
  },
  location: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        return /^[1-9][0-9]{5}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid pincode!`,
    },
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "India",
  },
}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema);
