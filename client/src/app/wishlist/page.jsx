"use client";

import Link from "next/link";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

export default function WishlistPage() {
  const {
    wishlistItems,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">
        ❤️ My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-3xl font-bold">
            Wishlist is Empty
          </h2>

          <Link
            href="/"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className="border rounded-xl shadow p-4"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-52 w-full object-contain"
              />

              <h2 className="text-xl font-bold mt-4">
                {product.name}
              </h2>

              <p className="text-blue-600 text-2xl font-bold mt-2">
                ₹{product.price.toLocaleString()}
              </p>

              <div className="flex flex-col gap-3 mt-5">

                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-600 text-white py-3 rounded-lg"
                >
                  🛒 Add to Cart
                </button>

                <button
                  onClick={() =>
                    removeFromWishlist(product._id)
                  }
                  className="bg-red-600 text-white py-3 rounded-lg"
                >
                  ❌ Remove
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}