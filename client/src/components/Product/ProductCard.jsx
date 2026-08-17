"use client";

import Link from "next/link";
import { FaHeart, FaShoppingCart, FaStar } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  const discount =
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) /
            product.oldPrice) *
            100
        )
      : 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden relative">

      {/* Discount Badge */}
      {discount > 0 && (
        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full z-10">
          {discount}% OFF
        </span>
      )}

      {/* Out of Stock */}
      {product.stock <= 0 && (
        <span className="absolute top-3 right-3 bg-gray-700 text-white text-xs px-3 py-1 rounded-full z-10">
          Out of Stock
        </span>
      )}

      <Link href={`/products/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x400?text=No+Image";
          }}
          className="w-full h-56 object-cover cursor-pointer"
        />

        <div className="p-4 cursor-pointer">

          <h3 className="font-bold text-lg line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mt-2 text-yellow-500">
            <FaStar />
            <span>{product.rating}</span>
          </div>

          <div className="mt-3 flex items-center gap-3">

            <span className="text-2xl font-bold text-blue-600">
              ₹{Number(product.price).toLocaleString()}
            </span>

            {product.oldPrice > 0 && (
              <span className="line-through text-gray-400">
                ₹{Number(product.oldPrice).toLocaleString()}
              </span>
            )}

          </div>

        </div>
      </Link>

      <div className="p-4 pt-0 flex gap-2">

        <button
          disabled={product.stock <= 0}
          onClick={() => addToCart(product)}
          className={`flex-1 py-2 rounded-lg flex justify-center items-center gap-2 text-white ${
            product.stock > 0
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          <FaShoppingCart />
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>

        <button
          onClick={() => addToWishlist(product)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-lg"
        >
          <FaHeart />
        </button>

      </div>

    </div>
  );
}