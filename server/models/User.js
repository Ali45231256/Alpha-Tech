const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    fullName: String,
    phone: String,
    pincode: String,
    address: String,
    city: String,
    state: String,
    landmark: String,

    country: {
      type: String,
      default: "India",
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    default: "user",
  },

 addresses: [addressSchema],
});

module.exports = mongoose.model("User", userSchema);