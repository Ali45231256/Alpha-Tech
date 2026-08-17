const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    const doc = new PDFDocument({
      margin: 40,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    // ==========================
    // Header
    // ==========================

    doc
      .fontSize(24)
      .fillColor("#2563eb")
      .text("ALPHA TECH", {
        align: "center",
      });

    doc
      .fontSize(18)
      .fillColor("black")
      .text("ORDER INVOICE", {
        align: "center",
      });

    doc.moveDown(2);

    // ==========================
    // Customer Details
    // ==========================

    doc.fontSize(16).text("Customer Details");

    doc.moveDown();

    doc.fontSize(12);

    doc.text(`Customer : ${order.shippingAddress.fullName}`);
    doc.text(`Phone : ${order.shippingAddress.phone}`);
    doc.text(`Address : ${order.shippingAddress.address}`);
    doc.text(`City : ${order.shippingAddress.city}`);
    doc.text(`Pincode : ${order.shippingAddress.pincode}`);

    if (order.user) {
      doc.text(`Email : ${order.user.email}`);
    }

    doc.moveDown();

    // ==========================
    // Order Details
    // ==========================

    doc.fontSize(16).text("Order Details");

    doc.moveDown();

    doc.fontSize(12);

    doc.text(`Order ID : ${order._id}`);
    doc.text(`Status : ${order.orderStatus}`);
    doc.text(`Payment : ${order.paymentMethod}`);
    doc.text(
      `Date : ${new Date(order.createdAt).toLocaleString()}`
    );

    doc.moveDown(2);

    // ==========================
    // Products
    // ==========================

    doc.fontSize(16).text("Products");

    doc.moveDown();

    order.items.forEach((item, index) => {

      const subtotal = item.price * item.quantity;

      doc.text(
        `${index + 1}. ${item.name}`
      );

      doc.text(
        `Qty : ${item.quantity}`
      );

      doc.text(
        `Price : ₹${item.price}`
      );

      doc.text(
        `Subtotal : ₹${subtotal}`
      );

      doc.moveDown();
    });

    // ==========================
    // Total
    // ==========================

    doc.moveDown();

    doc
      .fontSize(18)
      .fillColor("green")
      .text(
        `Grand Total : ₹${order.totalPrice}`,
        {
          align: "right",
        }
      );

    doc.moveDown(2);

    doc
      .fontSize(14)
      .fillColor("black")
      .text(
        "Thank you for shopping with Alpha Tech ❤️",
        {
          align: "center",
        }
      );

    doc.end();

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};