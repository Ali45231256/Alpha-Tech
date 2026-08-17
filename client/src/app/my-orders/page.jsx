"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);

      if (!user?._id) {
        setLoading(false);
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/orders/user/${user._id}`
      );

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log("Load Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };
  const cancelOrder = async (orderId) => {
  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmCancel) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/orders/${orderId}/cancel`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (data.success) {
      alert("Order Cancelled Successfully");
      loadOrders();
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log("Cancel Order Error:", error);
    alert("Failed to cancel order");
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";

      case "Confirmed":
        return "bg-cyan-500";

      case "Packed":
        return "bg-indigo-500";

      case "Shipped":
        return "bg-purple-500";

      case "Out For Delivery":
        return "bg-orange-500";

      case "Delivered":
        return "bg-green-600";

      case "Cancelled":
        return "bg-red-600";

      default:
        return "bg-gray-500";
    }
  };

  const getStep = (status) => {
    switch (status) {
      case "Pending":
        return 1;

      case "Confirmed":
        return 2;

      case "Packed":
        return 3;

      case "Shipped":
        return 4;

      case "Out For Delivery":
        return 5;

      case "Delivered":
        return 6;

      case "Cancelled":
        return -1;

      default:
        return 0;
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-5 py-10">

        {/* Page Heading */}
        <h1 className="text-4xl font-bold mb-10">
          📦 My Orders
        </h1>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold">
              Loading Orders...
            </h2>
          </div>
        ) : orders.length === 0 ? (
          /* Empty Orders */
          <div className="text-center py-20">

            <h2 className="text-3xl font-bold">
              No Orders Found 😔
            </h2>

            <p className="text-gray-500 mt-3">
              You have not placed any orders yet.
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
            >
              🛍 Continue Shopping
            </button>

          </div>
        ) : (
          /* Orders */
          orders.map((order) => {
            const step = getStep(order.orderStatus);

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-lg border p-6 mb-8"
              >

                {/* ================= HEADER ================= */}

                <div className="flex justify-between items-center flex-wrap gap-4">

                  <div>

                    <h2 className="text-2xl font-bold">
                      Order #{order._id.slice(-6)}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                  </div>

                  <span
                    className={`px-5 py-2 rounded-full text-white font-bold ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>

                </div>

                {/* ================= CANCELLED ================= */}

                {order.orderStatus === "Cancelled" ? (

                  <div className="mt-8 bg-red-100 border border-red-300 rounded-xl p-6 text-center">

                    <h2 className="text-3xl font-bold text-red-600">
                      ❌ Order Cancelled
                    </h2>

                    <p className="mt-2 text-red-500">
                      This order has been cancelled.
                    </p>

                  </div>

                ) : (

                  <>
                    {/* ================= TIMELINE ================= */}

                    <div className="mt-10 overflow-x-auto">

                      <div className="flex items-center min-w-[900px]">

                        {[
                          "Pending",
                          "Confirmed",
                          "Packed",
                          "Shipped",
                          "Out For Delivery",
                          "Delivered",
                        ].map((status, index) => (

                          <div
                            key={status}
                            className="flex items-center flex-1"
                          >

                            {/* Circle + Text */}

                            <div className="flex flex-col items-center">

                              <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${step >= index + 1
                                  ? "bg-green-600"
                                  : "bg-gray-300"
                                  }`}
                              >
                                {step >= index + 1
                                  ? "✓"
                                  : index + 1}
                              </div>

                              <p className="text-xs text-center mt-2 font-semibold w-24">
                                {status}
                              </p>

                            </div>

                            {/* Line */}

                            {index !== 5 && (
                              <div
                                className={`flex-1 h-1 ${step > index + 1
                                  ? "bg-green-600"
                                  : "bg-gray-300"
                                  }`}
                              />
                            )}

                          </div>

                        ))}

                      </div>

                    </div>

                    {/* ================= PRODUCTS ================= */}

                    <div className="mt-10">

                      <h2 className="text-2xl font-bold mb-5">
                        Products
                      </h2>

                      {order.items?.map((item, index) => (

                        <div
                          key={item._id || index}
                          className="flex items-center gap-5 border-b py-5"
                        >

                          {/* Product Image */}

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg border"
                          />

                          {/* Product Details */}

                          <div className="flex-1">

                            <h3 className="text-lg font-bold">
                              {item.name}
                            </h3>

                            <p className="text-gray-500 mt-1">
                              Quantity : {item.quantity}
                            </p>

                            <p className="font-bold text-green-600 mt-1">
                              ₹
                              {Number(item.price || 0).toLocaleString()}
                            </p>

                          </div>

                        </div>

                      ))}

                    </div>

                    {/* ================= SHIPPING ================= */}

                    <div className="mt-8 bg-gray-50 rounded-xl p-6">

                      <h2 className="text-xl font-bold mb-4">
                        🚚 Shipping Address
                      </h2>

                      <p>
                        <b>
                          {order.shippingAddress?.fullName}
                        </b>
                      </p>

                      <p>
                        {order.shippingAddress?.phone}
                      </p>

                      <p>
                        {order.shippingAddress?.address}
                      </p>

                      <p>
                        {order.shippingAddress?.city} -{" "}
                        {order.shippingAddress?.pincode}
                      </p>

                    </div>

                    {/* ================= BOTTOM ================= */}

                    <div className="mt-8 flex justify-between items-center flex-wrap gap-5">

                      {/* Price */}

                      <div>

                        <h2 className="text-3xl font-bold">
                          ₹
                          {Number(
                            order.totalPrice || 0
                          ).toLocaleString()}
                        </h2>

                        <p className="mt-2">
                          Payment :
                          <b>
                            {" "}
                            {order.paymentMethod}
                          </b>
                        </p>

                        <p className="mt-2 text-green-600">
                          Estimated Delivery :
                          <b>
                            {" "}
                            3-5 Business Days
                          </b>
                        </p>

                      </div>

                      {/* Buttons */}

                      <div className="flex gap-3 flex-wrap">

                        {/* Invoice */}

                        <a
                          href={`http://localhost:5000/api/invoice/${order._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition"
                        >
                          📄 Download Invoice
                        </a>

                        {/* Refresh */}

                        <button
                          onClick={loadOrders}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition"
                        >
                          🔄 Refresh Status
                        </button>

                        {/* View Details */}

                        <button
                          onClick={() =>
                            router.push(
                              `/my-orders/${order._id}`
                            )
                          }
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold transition"
                        >
                          👁 View Details
                        </button>
                        {(order.orderStatus === "Pending" ||
                          order.orderStatus === "Confirmed") && (
                            <button
                              onClick={() => cancelOrder(order._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition"
                            >
                              ❌ Cancel Order
                            </button>
                          )}

                      </div>

                    </div>

                  </>
                )}

              </div>
            );
          })
        )}

      </div>
    </ProtectedRoute>
  );
}