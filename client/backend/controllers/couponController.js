const Coupon = require("../models/Coupon");

// Create Coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discount } = req.body;

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount,
    });

    res.json({
      success: true,
      coupon,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Apply Coupon
exports.applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {
      return res.json({
        success: false,
        message: "Invalid Coupon",
      });
    }

    res.json({
      success: true,
      discount: coupon.discount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};