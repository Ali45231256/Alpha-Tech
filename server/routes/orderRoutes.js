const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");
// ===============================
// PLACE ORDER
// ===============================
router.post("/", placeOrder);

// ===============================
// GET ALL ORDERS
// ===============================
router.get("/", getOrders);

// ===============================
// GET USER ORDERS
// IMPORTANT: /user/:userId must
// come BEFORE /:id
// ===============================
router.get("/user/:userId", getUserOrders);

// ===============================
// GET SINGLE ORDER
// ===============================
router.get("/:id", getOrderById);

// ===============================
// UPDATE ORDER STATUS
// ===============================
router.put("/:id/status", updateOrderStatus);

// CANCLE ODER//
router.put("/:id/cancel", cancelOrder);

module.exports = router;