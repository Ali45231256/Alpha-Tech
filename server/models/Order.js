const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],

    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },

    paymentMethod: {
      type: String,
      default: "Cash On Delivery",
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    orderStatus: {
  type: String,
  enum: [
    "Pending",
    "Confirmed",
    "Packed",
    "Shipped",
    "Out For Delivery",
    "Delivered",
    "Cancelled",
  ],
  default: "Pending",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);