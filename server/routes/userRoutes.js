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

router.get("/profile/:id", getProfile);

router.put("/profile/:id", updateProfile);

router.put("/change-password/:id", changePassword);

router.get("/:id/addresses", getAddresses);

router.post("/:id/addresses", addAddress);

router.put("/:userId/addresses/:addressId", updateAddress);

router.delete("/:userId/addresses/:addressId", deleteAddress);

module.exports = router;