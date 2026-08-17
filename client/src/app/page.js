"use client";

import { useEffect, useState } from "react";

import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import Banner from "../components/Banner/Banner";
import CategorySection from "../components/Category/CategorySection";
import ProductCard from "../components/Product/ProductCard";
import Footer from "../components/Footer/Footer";

import { useSearch } from "../context/SearchContext";

export default function Home() {
  const { search } = useSearch();

  const [products, setProducts] = useState([]);

  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();

        setProducts(data.products || []);
      } catch (err) {
        console.log(err);
      }
    }

    loadProducts();
  }, []);

  let filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "" || product.category === category;

    const matchMin =
      minPrice === "" || product.price >= Number(minPrice);

    const matchMax =
      maxPrice === "" || product.price <= Number(maxPrice);

    const matchRating =
      rating === "" || product.rating >= Number(rating);

    return (
      matchSearch &&
      matchCategory &&
      matchMin &&
      matchMax &&
      matchRating
    );
  });

  if (sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const indexOfLastProduct = currentPage * productsPerPage;

  const indexOfFirstProduct =
    indexOfLastProduct - productsPerPage;

  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  return (
    <>
      <Header />
      <Navbar />
      <Banner />
      <CategorySection />

      <section className="max-w-7xl mx-auto mt-12 px-6">

        <div className="grid md:grid-cols-5 gap-4 mb-8">

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-3 rounded"
          >
            <option value="">All Categories</option>
            <option>Mobiles</option>
            <option>Laptops</option>
            <option>Headphones</option>
            <option>Smart Watches</option>
            <option>Cameras</option>
            <option>Accessories</option>
          </select>

          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-3 rounded"
          />

          <select
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-3 rounded"
          >
            <option value="">All Ratings</option>
            <option value="4">4★ & Above</option>
            <option value="3">3★ & Above</option>
            <option value="2">2★ & Above</option>
            <option value="1">1★ & Above</option>
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-3 rounded"
          >
            <option value="">Sort By</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>

        </div>

        <h2 className="text-3xl font-bold mb-8">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {currentProducts.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <h2 className="text-3xl font-bold">
                No Products Found 😔
              </h2>

              <p className="text-gray-500 mt-3">
                Try another keyword.
              </p>
            </div>
          ) : (
            currentProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))
          )}

        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-10">

            {Array.from(
              { length: totalPages },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}

          </div>
        )}

      </section>

      <Footer />
    </>
  );
}