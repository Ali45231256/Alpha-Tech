"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    fetchOrders();

    const wishlist =
      JSON.parse(localStorage.getItem("wishlist")) || [];

    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setWishlistCount(wishlist.length);
    setCartCount(cart.length);
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/user/${user._id}`
      );

      const data = await res.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold text-center mb-10">
          👤 My Profile
        </h1>

        {/* User Info */}
        <div className="bg-white shadow-xl rounded-xl p-8">

          <div className="flex items-center gap-5">

            <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                {user?.name}
              </h2>

              <p className="text-gray-600 mt-2">
                {user?.email}
              </p>

              <p className="mt-2 text-blue-600 font-bold capitalize">
                {user?.role}
              </p>
            </div>

          </div>

        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-blue-600 text-white rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold">Orders</h2>

            <p className="text-4xl mt-3">
              {orders.length}
            </p>
          </div>

          <div className="bg-pink-600 text-white rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold">Wishlist</h2>

            <p className="text-4xl mt-3">
              {wishlistCount}
            </p>
          </div>

          <div className="bg-green-600 text-white rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold">Cart</h2>

            <p className="text-4xl mt-3">
              {cartCount}
            </p>
          </div>

        </div>

<button
  onClick={() => router.push("/profile/change-password")}
  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
>
  🔒 Change Password
</button>

<button
  onClick={() => router.push("/profile/address")}
  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg"
>
  📍 Manage Address
</button>
        {/* Buttons */}
        <div className="flex flex-wrap gap-4 mt-10">

          <button
            onClick={() => router.push("/my-orders")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            📦 My Orders
          </button>

          <button
            onClick={() => router.push("/wishlist")}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg"
          >
            ❤️ Wishlist
          </button>

          <button
            onClick={() => router.push("/")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
          >
            🏠 Home
          </button>

          <button
            onClick={() => router.push("/profile/edit")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg"
          >
            ✏️ Edit Profile
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
          >
            🚪 Logout
          </button>

        </div>

      </div>
    </ProtectedRoute>
  );
}