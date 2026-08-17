const express = require("express");
const router = express.Router();

const {
  createCoupon,
  applyCoupon,
} = require("../controllers/couponController");

router.post("/", createCoupon);
router.post("/apply", applyCoupon);

module.exports = router;