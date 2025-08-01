const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,

    },
    mobile: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin', 'user'],
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
