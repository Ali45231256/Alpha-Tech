"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { FaShoppingCart, FaHeart, FaUser } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { search, setSearch } = useSearch();

  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    alert("Logged Out Successfully");
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="text-3xl font-bold text-blue-600">
          Alpha Tech
        </Link>

        {/* Search */}
        <div className="flex items-center w-[450px] border rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search Electronics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 outline-none"
          />
          <button className="bg-blue-600 text-white px-5 py-3">
            <FiSearch />
          </button>
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-6">

          {user ? (
            <>
              <Link
                href="/profile"
                className="font-semibold text-blue-600 hover:underline"
              >
                {user.name}
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <FaUser size={22} />
            </Link>
          )}

          <Link href="/wishlist" className="relative">
            <FaHeart size={22} />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {wishlistItems.length}
            </span>
          </Link>

          <Link href="/cart" className="relative">
            <FaShoppingCart size={22} />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {cartItems.length}
            </span>
          </Link>

        </div>

      </div>
    </header>
  );
}