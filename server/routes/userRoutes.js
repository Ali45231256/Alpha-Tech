const protect = require("../middleware/auth");
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

const {
  getProfile,
  updateProfile,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  changePassword,
} = require("../controllers/userController");

router.get("/profile/:id", protect, getProfile);

router.put("/profile/:id", protect, updateProfile);

router.put("/change-password/:id", protect, changePassword);

router.get("/:id/addresses", protect, getAddresses);

router.post("/:id/addresses", protect, addAddress);

router.put("/:userId/addresses/:addressId", protect, updateAddress);

router.delete("/:userId/addresses/:addressId", protect, deleteAddress);

module.exports = router;