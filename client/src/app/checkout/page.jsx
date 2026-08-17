"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // =========================
  // Load Saved Addresses
  // =========================
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
          toast.error("Please Login First");
          router.push("/login");
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/users/${user._id}/addresses`
        );

        const data = await res.json();

        if (data.success) {
          setAddresses(data.addresses || []);

          // Automatically select first address
          if (data.addresses && data.addresses.length > 0) {
            const firstAddress = data.addresses[0];

            setSelectedAddress(firstAddress._id);

            setForm({
              name: firstAddress.fullName || "",
              phone: firstAddress.phone || "",
              address: firstAddress.address || "",
              city: firstAddress.city || "",
              state: firstAddress.state || "",
              pincode: firstAddress.pincode || "",
              country: firstAddress.country || "India",
            });
          }
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.log(err);
        toast.error("Unable to load addresses");
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [router]);

  // =========================
  // Form Change
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    // Manual editing means no saved address selected
    setSelectedAddress(null);
  };

  // =========================
  // Select Saved Address
  // =========================
  const selectAddress = (item) => {
    setSelectedAddress(item._id);

    setForm({
      name: item.fullName || "",
      phone: item.phone || "",
      address: item.address || "",
      city: item.city || "",
      state: item.state || "",
      pincode: item.pincode || "",
      country: item.country || "India",
    });

    toast.success("Address Selected");
  };

  // =========================
  // Apply Coupon
  // =========================
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Enter Coupon Code");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/coupons/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: couponCode.trim(),
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setDiscount(data.discount);
        toast.success(`Coupon Applied! ₹${data.discount} OFF`);
      } else {
        setDiscount(0);
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };

  // =========================
  // Place Order
  // =========================
  const placeOrder = async () => {
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.pincode.trim()
    ) {
      toast.error("Please fill all shipping fields");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        toast.error("Please Login First");
        router.push("/login");
        return;
      }

      const finalTotal = Math.max(0, totalPrice - discount);

      const res = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: user._id,

            items: cartItems.map((item) => ({
              product: item._id,
              name: item.name,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
            })),

            shippingAddress: {
              fullName: form.name,
              phone: form.phone,
              address: form.address,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
              country: form.country,
            },

            paymentMethod: "Cash On Delivery",

            totalPrice: finalTotal,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Order Placed Successfully 🎉");

        clearCart();

        router.replace("/my-orders");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };

  // =========================
  // Empty Cart
  // =========================
  if (cartItems.length === 0) {
    return (
      <ProtectedRoute>
        <div className="max-w-5xl mx-auto py-20 text-center">
          <h1 className="text-4xl font-bold">
            Cart is Empty 🛒
          </h1>

          <button
            onClick={() => router.push("/")}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-10">
          Checkout
        </h1>

        <div className="grid md:grid-cols-2 gap-10">

          {/* ================================= */}
          {/* SHIPPING ADDRESS */}
          {/* ================================= */}

          <div className="bg-white shadow rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-5">
              Shipping Address
            </h2>

            {/* Saved Addresses */}

            {loadingAddresses ? (
              <p className="text-gray-500 mb-5">
                Loading saved addresses...
              </p>
            ) : addresses.length > 0 ? (
              <div className="space-y-4 mb-8">

                <h3 className="font-bold text-lg">
                  Saved Addresses
                </h3>

                {addresses.map((item) => (
                  <div
                    key={item._id}
                    className={`border rounded-xl p-4 cursor-pointer transition ${
                      selectedAddress === item._id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }`}
                    onClick={() => selectAddress(item)}
                  >

                    <div className="flex justify-between">

                      <div>
                        <p className="font-bold">
                          {item.fullName}
                        </p>

                        <p className="text-gray-600">
                          📞 {item.phone}
                        </p>
                      </div>

                      {selectedAddress === item._id && (
                        <span className="text-blue-600 font-bold">
                          ✓ Selected
                        </span>
                      )}

                    </div>

                    <p className="mt-2">
                      {item.address}
                    </p>

                    <p>
                      {item.city}, {item.state}
                    </p>

                    <p>
                      {item.pincode}
                    </p>

                    <p>
                      {item.country || "India"}
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAddress(item);
                      }}
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Use This Address
                    </button>

                  </div>
                ))}

              </div>
            ) : (
              <div className="mb-6 bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
                <p className="font-semibold">
                  No saved address found.
                </p>

                <p className="text-sm text-gray-600">
                  Please enter your shipping address below.
                </p>
              </div>
            )}

            {/* Manual Address Form */}

            <h3 className="text-xl font-bold mb-4">
              {addresses.length > 0
                ? "Shipping Details"
                : "Enter Shipping Address"}
            </h3>

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded w-full mb-4"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="border p-3 rounded w-full mb-4"
            />

            <textarea
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="border p-3 rounded w-full mb-4"
            />

            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="border p-3 rounded w-full mb-4"
            />

            <input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="border p-3 rounded w-full mb-4"
            />

            <input
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="border p-3 rounded w-full mb-4"
            />

            <input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />

          </div>

          {/* ================================= */}
          {/* ORDER SUMMARY */}
          {/* ================================= */}

          <div className="bg-white shadow rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-5">
              Order Summary
            </h2>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex justify-between mb-3"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>
                  ₹
                  {(
                    item.price * item.quantity
                  ).toLocaleString()}
                </span>
              </div>
            ))}

            <hr className="my-5" />

            {/* Coupon */}

            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) =>
                setCouponCode(e.target.value)
              }
              className="border p-3 rounded w-full"
            />

            <button
              onClick={applyCoupon}
              className="w-full bg-purple-600 text-white py-3 rounded-lg mt-3 hover:bg-purple-700"
            >
              Apply Coupon
            </button>

            {discount > 0 && (
              <div className="mt-4 text-green-600 font-bold">
                Discount: ₹{discount}
              </div>
            )}

            {/* Price */}

            <div className="mt-5 border-t pt-5">

              <div className="flex justify-between text-lg">
                <span>Subtotal</span>

                <span>
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-bold mt-2">
                  <span>Discount</span>

                  <span>
                    - ₹{discount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-3xl font-bold mt-5">
                <span>Total</span>

                <span>
                  ₹
                  {Math.max(
                    0,
                    totalPrice - discount
                  ).toLocaleString()}
                </span>
              </div>

            </div>

            {/* Payment */}

            <div className="mt-6 bg-yellow-100 border border-yellow-400 rounded-lg p-4">

              <p className="font-bold">
                Payment Method
              </p>

              <p>
                Cash on Delivery (COD)
              </p>

            </div>

            {/* Place Order */}

            <button
              onClick={placeOrder}
              className="w-full bg-green-600 text-white py-4 rounded-xl mt-8 hover:bg-green-700 transition font-bold"
            >
              Place Order
            </button>

          </div>

        </div>

      </div>
    </ProtectedRoute>
  );
}