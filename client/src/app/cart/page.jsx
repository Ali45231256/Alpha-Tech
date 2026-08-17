"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { FaTrash } from "react-icons/fa";

export default function CartPage() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    totalPrice,
    deliveryCharge,
    gst,
    grandTotal,
  } = useCart();
  if (cartItems.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center">
        <h1 className="text-4xl font-bold">
          Your Cart is Empty 🛒
        </h1>
        <p className="text-gray-500 mt-2">
  {cartItems.length} Item{cartItems.length > 1 ? "s" : ""} in your cart
</p>
        <p className="mt-4 text-gray-500">
          Add products to your cart.
        </p>

        <Link href="/">
          <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-10">
        Shopping Cart
      </h1>

      {cartItems.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center bg-white shadow rounded-xl p-5 mb-5"
        >
          <div className="flex gap-5 items-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 rounded-lg object-cover"
            />

            <div>
              <h2 className="font-bold text-xl">
                {item.name}
              </h2>

              <p className="text-blue-600 font-semibold mt-1">
                ₹{item.price.toLocaleString()}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => decreaseQty(item._id)}
                  className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 font-bold"
                >
                  -
                </button>

                <span className="font-bold text-lg">
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQty(item._id)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <div className="text-2xl font-bold text-blue-600">
                ₹{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => removeItem(item._id)}
              className="mt-3 bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg flex items-center justify-center"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}

      <div className="mt-10 flex justify-end">

        <div className="bg-white shadow-xl rounded-xl p-8 w-[380px]">

          <h2 className="text-3xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between mb-3">
            <span>Subtotal</span>
            <span>₹{totalPrice.toLocaleString()}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>GST (18%)</span>
            <span>₹{gst.toLocaleString()}</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>Delivery</span>

            <span className="font-semibold">
              {deliveryCharge === 0 ? "FREE" : "₹" + deliveryCharge}
            </span>

          </div>

          <hr className="my-5" />

          <div className="flex justify-between text-2xl font-bold">
            <span>Total</span>

            <span className="text-blue-600">
              ₹{grandTotal.toLocaleString()}
            </span>

          </div>

          <Link href="/checkout">

            <button className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 py-4 rounded-xl font-bold">

              Proceed To Checkout

            </button>

          </Link>

          <button
            onClick={clearCart}
            className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-bold"
          >

            Clear Cart

          </button>

        </div>

      </div>
    </div>
  );
}