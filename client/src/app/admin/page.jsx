"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AdminDashboard() {
  const router = useRouter();

  const [dashboard, setDashboard] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "admin") {
      toast.error("Access Denied");
      router.replace("/");
      return;
    }

    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
  try {
    const [dashboardRes, productsRes] = await Promise.all([
      fetch("http://localhost:5000/api/dashboard"),
      fetch("http://localhost:5000/api/products"),
    ]);

    const dashboardData = await dashboardRes.json();
    const productsData = await productsRes.json();

    if (dashboardData.success) {
      setDashboard(dashboardData);
    } else {
      toast.error(dashboardData.message);
    }

    if (productsData.success) {
      setProducts(productsData.products);
    }
  } catch (err) {
    console.log(err);
    toast.error("Failed to load dashboard");
  }
};
  if (!dashboard) {
    return (
      <div className="flex justify-center items-center h-screen text-3xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-10">
        📊 Admin Dashboard
      </h1>

      {/* Dashboard Cards */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-blue-600 text-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg">Total Sales</h2>

          <p className="text-3xl font-bold mt-3">
            ₹{(dashboard.totalRevenue || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-green-600 text-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg">Total Orders</h2>

          <p className="text-3xl font-bold mt-3">
            {dashboard.totalOrders}
          </p>
        </div>

        <div className="bg-purple-600 text-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg">Total Products</h2>

          <p className="text-3xl font-bold mt-3">
            {dashboard.totalProducts}
          </p>
        </div>

        <div className="bg-orange-500 text-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg">Total Users</h2>

          <p className="text-3xl font-bold mt-3">
            {dashboard.totalUsers}
          </p>
        </div>

      </div>
{/* Stock Summary */}

<div className="grid md:grid-cols-4 gap-6 mt-10">

  {/* Total Stock */}
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-lg">
    <h2 className="text-lg font-semibold text-blue-700">
      📦 Total Stock
    </h2>

    <p className="text-4xl font-bold text-blue-700 mt-3">
      {products.reduce(
        (total, product) =>
          total + Number(product.stock || 0),
        0
      )}
    </p>

    <p className="text-gray-600 mt-2">
      Total items available
    </p>
  </div>

  {/* In Stock */}
  <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-lg">
    <h2 className="text-lg font-semibold text-green-700">
      🟢 In Stock
    </h2>

    <p className="text-4xl font-bold text-green-700 mt-3">
      {
        products.filter(
          (product) => Number(product.stock) > 5
        ).length
      }
    </p>

    <p className="text-gray-600 mt-2">
      Products with more than 5 items
    </p>
  </div>

  {/* Low Stock */}
  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow-lg">
    <h2 className="text-lg font-semibold text-orange-700">
      🟠 Low Stock
    </h2>

    <p className="text-4xl font-bold text-orange-700 mt-3">
      {
        products.filter(
          (product) =>
            Number(product.stock) > 0 &&
            Number(product.stock) <= 5
        ).length
      }
    </p>

    <p className="text-gray-600 mt-2">
      Products with 1-5 items
    </p>
  </div>

  {/* Out Of Stock */}
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg">
    <h2 className="text-lg font-semibold text-red-700">
      🔴 Out Of Stock
    </h2>

    <p className="text-4xl font-bold text-red-700 mt-3">
      {
        products.filter(
          (product) => Number(product.stock) === 0
        ).length
      }
    </p>

    <p className="text-gray-600 mt-2">
      Products currently unavailable
    </p>
  </div>

</div>
      {/* Monthly Sales Chart */}

      <div className="bg-white rounded-xl shadow-lg mt-10 p-6">

        <h2 className="text-2xl font-bold mb-6">
          📈 Monthly Sales
        </h2>

        <ResponsiveContainer width="100%" height={350}>

          <BarChart data={dashboard.monthlySales}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="sales"
              fill="#2563eb"
              radius={[8, 8, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>
      {/* Analytics */}

      <div className="grid lg:grid-cols-3 gap-6 mt-10">

        {/* Top Products */}

        <div className="bg-white shadow-xl rounded-xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            📦 Top Products
          </h2>

          {dashboard.topProducts.length > 0 ? (
            dashboard.topProducts.map((product, index) => (
              <div
                key={index}
                className="flex justify-between py-3 border-b"
              >
                <span>{product.name}</span>

                <span className="font-bold text-blue-600">
                  {product.sold} Sold
                </span>
              </div>
            ))
          ) : (
            <p>No Products Found</p>
          )}

        </div>

        {/* Top Customers */}

        <div className="bg-white shadow-xl rounded-xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            👥 Top Customers
          </h2>

          {dashboard.topCustomers.length > 0 ? (
            dashboard.topCustomers.map((customer, index) => (
              <div
                key={index}
                className="flex justify-between py-3 border-b"
              >
                <span>{customer.name}</span>

                <span className="font-bold text-green-600">
                  ₹{customer.spent.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <p>No Customers Found</p>
          )}

        </div>

        {/* Order Status */}

        <div className="bg-white shadow-xl rounded-xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            📊 Order Status
          </h2>

          {Object.entries(dashboard.orderStatus).map(
            ([status, count]) => (

              <div
                key={status}
                className="flex justify-between py-3 border-b"
              >

                <span>{status}</span>

                <span className="font-bold text-blue-600">
                  {count}
                </span>

              </div>

            )
          )}

        </div>

      </div>      {/* Recent Orders */}

      <div className="bg-white shadow-xl rounded-xl mt-10 p-6">

        <h2 className="text-2xl font-bold mb-6">
          📦 Recent Orders
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-gray-100">

                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>

              </tr>

            </thead>

            <tbody>

              {dashboard.recentOrders.map((order) => (

                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-3">
                    {order.shippingAddress?.fullName}
                  </td>

                  <td className="p-3 font-bold">
                    ₹{order.totalPrice.toLocaleString()}
                  </td>

                  <td className="p-3">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold
                      ${order.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "Confirmed"
                            ? "bg-cyan-100 text-cyan-700"
                            : order.orderStatus === "Packed"
                              ? "bg-indigo-100 text-indigo-700"
                              : order.orderStatus === "Shipped"
                                ? "bg-purple-100 text-purple-700"
                                : order.orderStatus === "Out For Delivery"
                                  ? "bg-orange-100 text-orange-700"
                                  : order.orderStatus === "Cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {order.orderStatus}
                    </span>

                  </td>

                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <a
          href="/admin/products"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-6 text-center shadow-lg transition"
        >
          <h2 className="text-2xl font-bold">
            📦 Products
          </h2>

          <p className="mt-2">
            Manage Products
          </p>
        </a>

        <a
          href="/admin/orders"
          className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6 text-center shadow-lg transition"
        >
          <h2 className="text-2xl font-bold">
            🛒 Orders
          </h2>

          <p className="mt-2">
            Manage Orders
          </p>
        </a>

        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6 text-center shadow-lg transition"
        >
          <h2 className="text-2xl font-bold">
            🏠 Home
          </h2>

          <p className="mt-2">
            Go to Website
          </p>
        </a>

      </div>

    </div>
  );
}