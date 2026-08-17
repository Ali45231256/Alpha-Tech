"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load orders");
    }
  };

  // Update Status
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
       toast.success("Order Status Updated");
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };

  // Status Badge Color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Confirmed":
        return "bg-blue-100 text-blue-700";

      case "Packed":
        return "bg-indigo-100 text-indigo-700";

      case "Shipped":
        return "bg-purple-100 text-purple-700";

      case "Out For Delivery":
        return "bg-orange-100 text-orange-700";

      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-10">
        📦 Manage Orders
      </h1>

      <div className="flex gap-4 mb-8">
        <a
          href="/admin"
          className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          Dashboard
        </a>

        <a
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Home
        </a>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold">
            No Orders Found 📦
          </h2>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-6 mb-8 shadow bg-white"
          >
            <h2 className="text-2xl font-bold">
              {order.shippingAddress.fullName}
            </h2>

            <p>{order.shippingAddress.phone}</p>

            <p>{order.shippingAddress.address}</p>

            <p>
              {order.shippingAddress.city} -{" "}
              {order.shippingAddress.pincode}
            </p>

            <hr className="my-5" />

            <h3 className="font-bold text-lg mb-3">
              Products
            </h3>

            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between py-2"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  ₹{item.price}
                </span>
              </div>
            ))}

            <hr className="my-5" />

            <h2 className="text-2xl font-bold">
              Total ₹{order.totalPrice}
            </h2>

            <p className="mt-2">
              <strong>Payment :</strong>{" "}
              {order.paymentMethod}
            </p>

            <p className="mt-2">
              <strong>Order Date :</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <p className="mt-4">
              Status :
              <span
                className={`ml-2 px-3 py-1 rounded-full font-bold ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
            </p>

            <div className="flex gap-4 mt-6 flex-wrap">

              <select
                value={order.orderStatus}
                onChange={(e) =>
                  updateStatus(
                    order._id,
                    e.target.value
                  )
                }
                className="border p-3 rounded-lg"
              >
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Packed</option>
                <option>Shipped</option>
                <option>Out For Delivery</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>

              <a
                href={`http://localhost:5000/api/invoice/${order._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
              >
                📄 Download Invoice
              </a>

            </div>
          </div>
        ))
      )}

    </div>
  );
}