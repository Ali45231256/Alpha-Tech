"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

const categories = [
  "Mobiles",
  "Laptops",
  "Headphones",
  "Smart Watches",
  "Cameras",
  "Accessories",
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const { cartItems } = useCart();

  const router = useRouter();

  const handleLogout = () => {
    logout();
    alert("Logged Out Successfully");
    router.push("/login");
  };

  return (
    <nav className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Categories */}
        <div className="flex gap-6 overflow-x-auto">
          {categories.map((item) => (
            <Link
              key={item}
              href={`/category/${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-yellow-400 whitespace-nowrap"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-5">

          <Link
            href="/wishlist"
            className="hover:text-pink-400"
          >
            ❤️ Wishlist ({wishlistItems.length})
          </Link>

          <Link
            href="/cart"
            className="hover:text-green-400"
          >
            🛒 Cart ({cartItems.length})
          </Link>

          {user && (
            <Link
              href="/my-orders"
              className="hover:text-cyan-400"
            >
              📦 My Orders
            </Link>
          )}

          {user ? (
            <>
              <span className="text-yellow-400">
                👋 {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-yellow-400"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="hover:text-yellow-400"
              >
                Register
              </Link>
            </>
          )}

        </div>

      </div>
    </nav>
  );
}