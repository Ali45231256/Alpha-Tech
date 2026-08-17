"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    oldPrice: "",
    stock: "",
    image: "",
    category: "",
    rating: 5,
    description: "",
  });

  // ==========================================
  // Form Change
  // ==========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // Upload Image
  // ==========================================

  const uploadImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const res = await fetch(
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        setForm((prev) => ({
          ...prev,
          image: data.imageUrl,
        }));

        toast.success("Image Uploaded");
      } else {
        toast.error(data.message || "Upload Failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // Fetch Products
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await res.json();

      if (data.success) {
        setProducts(data.products || []);
      } else {
        toast.error(data.message || "Failed to load products");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // Reset Form
  // ==========================================

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      oldPrice: "",
      stock: "",
      image: "",
      category: "",
      rating: 5,
      description: "",
    });

    setPreview("");
    setEditingProduct(null);
  };

  // ==========================================
  // Edit Product
  // ==========================================

  const editProduct = (product) => {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      price: product.price ?? "",
      oldPrice: product.oldPrice ?? "",
      stock: product.stock ?? "",
      image: product.image || "",
      category: product.category || "",
      rating: product.rating ?? 5,
      description: product.description || "",
    });

    setPreview(product.image || "");
    setShowForm(true);
  };

  // ==========================================
  // Add / Update Product
  // ==========================================

  const saveProduct = async () => {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!form.price) {
      toast.error("Product price is required");
      return;
    }

    if (form.stock === "") {
      toast.error("Product stock is required");
      return;
    }

    try {
      let url = "http://localhost:5000/api/products";
      let method = "POST";

      if (editingProduct) {
        url = `http://localhost:5000/api/products/${editingProduct._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          oldPrice: Number(form.oldPrice || 0),
          stock: Number(form.stock),
          rating: Number(form.rating || 5),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          editingProduct
            ? "Product Updated Successfully"
            : "Product Added Successfully"
        );

        setShowForm(false);
        resetForm();

        fetchProducts();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  // ==========================================
  // Delete Product
  // ==========================================

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Product Deleted");
        fetchProducts();
      } else {
        toast.error(data.message || "Delete Failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Delete Failed");
    }
  };

  // ==========================================
  // Update Stock
  // ==========================================

  const updateStock = async (id, newStock) => {
    try {
      const stock = Number(newStock);

      if (Number.isNaN(stock) || stock < 0) {
        toast.error("Stock cannot be negative");
        fetchProducts();
        return;
      }

      const res = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stock,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Stock Updated");

        setProducts((prev) =>
          prev.map((product) =>
            product._id === id
              ? {
                  ...product,
                  stock,
                }
              : product
          )
        );
      } else {
        toast.error(data.message || "Stock Update Failed");
        fetchProducts();
      }
    } catch (err) {
      console.log(err);
      toast.error("Stock Update Failed");
      fetchProducts();
    }
  };

  // ==========================================
  // Close Form
  // ==========================================

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-3xl font-bold">
        Loading Products...
      </div>
    );
  }

  // ==========================================
  // Stock Data
  // ==========================================

  const lowStockProducts = products.filter(
    (product) =>
      Number(product.stock) > 0 &&
      Number(product.stock) <= 5
  );

  const outOfStockProducts = products.filter(
    (product) => Number(product.stock) === 0
  );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="max-w-7xl mx-auto p-8">

      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          📦 Products
        </h1>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          + Add Product
        </button>

      </div>

      {/* ====================================== */}
      {/* Stock Alerts */}
      {/* ====================================== */}

      <div className="grid md:grid-cols-2 gap-6 mb-8">

        {/* Low Stock */}

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 shadow">

          <h2 className="text-2xl font-bold text-orange-700 mb-4">
            🟠 Low Stock Products
          </h2>

          {lowStockProducts.length === 0 ? (
            <p className="text-gray-600">
              No low stock products 🎉
            </p>
          ) : (
            <div className="space-y-3">

              {lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg border"
                >

                  <div>
                    <p className="font-bold">
                      {product.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {product.category}
                    </p>
                  </div>

                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">
                    {product.stock} left
                  </span>

                </div>
              ))}

            </div>
          )}

        </div>

        {/* Out Of Stock */}

        <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow">

          <h2 className="text-2xl font-bold text-red-700 mb-4">
            🔴 Out Of Stock Products
          </h2>

          {outOfStockProducts.length === 0 ? (
            <p className="text-gray-600">
              No out of stock products 🎉
            </p>
          ) : (
            <div className="space-y-3">

              {outOfStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg border"
                >

                  <div>
                    <p className="font-bold">
                      {product.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {product.category}
                    </p>
                  </div>

                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
                    Out Of Stock
                  </span>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

      {/* ====================================== */}
      {/* Add / Edit Form */}
      {/* ====================================== */}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-8 w-[700px] max-w-[95%] max-h-[90vh] overflow-y-auto">

            <h2 className="text-3xl font-bold mb-6">
              {editingProduct
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="border p-3 rounded"
              />

              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                className="border p-3 rounded"
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="border p-3 rounded"
              />

              <input
                name="oldPrice"
                type="number"
                placeholder="Old Price"
                value={form.oldPrice}
                onChange={handleChange}
                className="border p-3 rounded"
              />

              <input
                name="stock"
                type="number"
                min="0"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                className="border p-3 rounded"
              />

              <input
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Rating"
                value={form.rating}
                onChange={handleChange}
                className="border p-3 rounded"
              />

            </div>

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="border p-3 rounded w-full mt-4"
              rows={4}
            />

            {/* Image */}

            <div className="mt-4">

              <label className="block font-semibold mb-2">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={uploadImage}
                className="border p-2 rounded w-full"
              />

              {uploading && (
                <p className="text-blue-600 mt-2">
                  Uploading Image...
                </p>
              )}

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg mt-4 border"
                />
              )}

              <input
                type="text"
                value={form.image}
                readOnly
                className="border p-2 rounded w-full mt-3 bg-gray-100"
                placeholder="Image URL"
              />

            </div>

            {/* Form Buttons */}

            <div className="flex gap-4 mt-6">

              <button
                onClick={saveProduct}
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
              >
                {uploading
                  ? "Uploading..."
                  : editingProduct
                    ? "Update Product"
                    : "Save Product"}
              </button>

              <button
                onClick={closeForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ====================================== */}
      {/* Products Table */}
      {/* ====================================== */}

      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Image
              </th>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Rating
              </th>

              <th className="p-4 text-left">
                Stock
              </th>

              <th className="p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {products.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  className="p-10 text-center text-gray-500"
                >
                  No Products Found
                </td>
              </tr>

            ) : (

              products.map((product) => {

                const stock = Number(product.stock || 0);

                return (
                  <tr
                    key={product._id}
                    className="border-b hover:bg-gray-50"
                  >

                    {/* Image */}

                    <td className="p-4">

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs">
                          No Image
                        </div>
                      )}

                    </td>

                    {/* Name */}

                    <td className="p-4 font-semibold">
                      {product.name}
                    </td>

                    {/* Category */}

                    <td className="p-4">
                      {product.category}
                    </td>

                    {/* Price */}

                    <td className="p-4 font-bold">
                      ₹{Number(product.price || 0).toLocaleString()}
                    </td>

                    {/* Rating */}

                    <td className="p-4">
                      ⭐ {product.rating || 0}
                    </td>

                    {/* Stock */}

                    <td className="p-4">

                      <div className="flex items-center gap-2">

                        <input
                          type="number"
                          min="0"
                          value={product.stock ?? 0}
                          onChange={(e) => {

                            const value = e.target.value;

                            setProducts((prev) =>
                              prev.map((p) =>
                                p._id === product._id
                                  ? {
                                      ...p,
                                      stock: value,
                                    }
                                  : p
                              )
                            );

                          }}
                          onBlur={(e) =>
                            updateStock(
                              product._id,
                              e.target.value
                            )
                          }
                          className={`w-20 border rounded-lg px-2 py-2 font-bold text-center ${
                            stock === 0
                              ? "border-red-400 text-red-600"
                              : stock <= 5
                                ? "border-orange-400 text-orange-600"
                                : "border-green-400 text-green-600"
                          }`}
                        />

                        <span
                          className={`text-xs font-bold px-2 py-1 rounded-full ${
                            stock === 0
                              ? "bg-red-100 text-red-700"
                              : stock <= 5
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {stock === 0
                            ? "Out"
                            : stock <= 5
                              ? "Low"
                              : "In Stock"}
                        </span>

                      </div>

                    </td>

                    {/* Actions */}

                    <td className="p-4">

                      <div className="flex justify-center gap-3">

                        <button
                          onClick={() =>
                            editProduct(product)
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteProduct(product._id)
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}