"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../src/context/CartContext";

export default function ProductDetailsClient({ product }) {
  const { addToCart } = useCart();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${product._id}`
      );

      const data = await res.json();

      if (data.success) {
        setReviews(data.product.reviews || []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitReview = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/products/review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
            userId: user._id,
            name: user.name,
            rating,
            comment,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Review Added Successfully");

        setComment("");
        setRating(5);

        loadReviews();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <Link
        href="/"
        className="text-blue-600 hover:underline"
      >
        ← Back to Home
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-xl shadow-lg"
        />

        <div>
          <h1 className="text-4xl font-bold">
            {product.name}
          </h1>

          <p className="text-yellow-500 text-xl mt-3">
            ⭐ {product.rating}
          </p>

          <h2 className="text-4xl text-blue-600 font-bold mt-4">
            ₹{product.price.toLocaleString()}
          </h2>

          <p className="text-gray-500 line-through mt-2">
            ₹{product.oldPrice.toLocaleString()}
          </p>

          <p className="mt-6 text-gray-700">
            {product.description}
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg"
            >
              Add To Cart
            </button>

            <button className="bg-yellow-400 px-8 py-3 rounded-lg">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6">
          Reviews
        </h2>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-3 rounded w-full mb-3"
        >
          <option value={5}>⭐⭐⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={1}>⭐</option>
        </select>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="border rounded w-full p-3"
        />

        <button
          onClick={submitReview}
          className="bg-green-600 text-white px-8 py-3 rounded mt-4"
        >
          Submit Review
        </button>

        <div className="mt-10 space-y-4">
          {reviews.length === 0 ? (
            <p>No Reviews Yet</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="border rounded-lg p-4"
              >
                <h3 className="font-bold">
                  {review.name}
                </h3>

                <p className="text-yellow-500">
                  ⭐ {review.rating}
                </p>

                <p>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}