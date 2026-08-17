const Product = require("../models/Product");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const Order = require("../models/Order");

// ======================================
// Place Order
// ======================================
exports.placeOrder = async (req, res) => {
  try {
    const {
      user,
      items,
      shippingAddress,
      totalPrice,
      paymentMethod,
    } = req.body;

    // Check stock and reduce stock
    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `${item.name} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${item.name} is out of stock`,
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    // Create Order
    const order = await Order.create({
      user,
      items,
      shippingAddress,
      totalPrice,
      paymentMethod: paymentMethod || "Cash On Delivery",
      orderStatus: "Pending",
    });

    // Send confirmation email
    const customer = await User.findById(user);

    if (customer) {
      await sendEmail(
        customer.email,
        "🎉 Order Confirmed - Alpha Tech",
        `
        <div style="font-family:Arial;padding:20px">

          <h2>Thank You ${customer.name} ❤️</h2>

          <p>Your order has been placed successfully.</p>

          <h3>Order Details</h3>

          <p><b>Order ID:</b> ${order._id}</p>
          <p><b>Total:</b> ₹${order.totalPrice}</p>
          <p><b>Payment:</b> ${order.paymentMethod}</p>
          <p><b>Status:</b> ${order.orderStatus}</p>

          <br>

          <h3>Shipping Address</h3>

          <p>${shippingAddress.fullName}</p>
          <p>${shippingAddress.address}</p>
          <p>${shippingAddress.city}</p>
          <p>${shippingAddress.pincode}</p>

          <br>

          <h2>Alpha Tech</h2>
          <p>Your order is being processed.</p>

        </div>
        `
      );
    }

    res.status(201).json({
      success: true,
      message: "Order Placed Successfully",
      order,
    });

  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Get All Orders
// ======================================
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Get User Orders
// ======================================
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Get Single Order
// ======================================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("GET SINGLE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Update Order Status
// ======================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id)
      .populate("user");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    const oldStatus = order.orderStatus;

    // ======================================
    // Cancel Order + Restore Stock
    // ======================================
    if (status === "Cancelled" && oldStatus !== "Cancelled") {

      // Sirf Pending aur Confirmed order cancel ho sakte hain
      if (
        oldStatus !== "Pending" &&
        oldStatus !== "Confirmed"
      ) {
        return res.status(400).json({
          success: false,
          message: "This order cannot be cancelled now",
        });
      }

      // Restore Product Stock
      for (const item of order.items) {

        const product = await Product.findById(item.product);

        if (product) {
          product.stock += item.quantity;

          await product.save();
        }
      }
    }

    // ======================================
    // Update Status
    // ======================================
    order.orderStatus = status;

    await order.save();

    // ======================================
    // Send Status Email
    // ======================================
    if (order.user) {

      await sendEmail(
        order.user.email,
        `📦 Alpha Tech - Order ${status}`,
        `
        <div style="font-family:Arial;padding:20px">

          <h2>Hello ${order.user.name},</h2>

          <p>Your order status has been updated.</p>

          <table
            style="border-collapse:collapse;width:100%;margin-top:15px"
          >

            <tr>
              <td><b>Order ID</b></td>
              <td>${order._id}</td>
            </tr>

            <tr>
              <td><b>New Status</b></td>
              <td style="color:#2563eb;font-weight:bold">
                ${status}
              </td>
            </tr>

            <tr>
              <td><b>Payment Method</b></td>
              <td>${order.paymentMethod}</td>
            </tr>

            <tr>
              <td><b>Total</b></td>
              <td>₹${order.totalPrice}</td>
            </tr>

          </table>

          <br>

          <p>
            You can check your order anytime from your account.
          </p>

          <br>

          <h3>
            Thank you for shopping with Alpha Tech ❤️
          </h3>

        </div>
        `
      );
    }

    res.json({
      success: true,
      message:
        status === "Cancelled"
          ? "Order Cancelled and Stock Restored Successfully"
          : "Order Status Updated Successfully",
      order,
    });

  } catch (error) {

    console.error("UPDATE ORDER STATUS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================
// Cancel Order + Restore Stock
// ======================================
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Sirf Pending aur Confirmed order cancel ho sakte hain
    if (
      order.orderStatus !== "Pending" &&
      order.orderStatus !== "Confirmed"
    ) {
      return res.status(400).json({
        success: false,
        message: "This order cannot be cancelled now",
      });
    }

    // ======================================
    // Restore Product Stock
    // ======================================
    for (const item of order.items) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    // ======================================
    // Update Order Status
    // ======================================
    order.orderStatus = "Cancelled";

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled and stock restored successfully",
      order,
    });

  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};