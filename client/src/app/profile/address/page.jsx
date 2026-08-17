"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute/ProtectedRoute";
import toast from "react-hot-toast";

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${user._id}/addresses`
      );

      const data = await res.json();

      if (data.success) {
        setAddresses(data.addresses);
      }
    } catch (err) {
      console.log(err);
    }
  };
    const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addAddress = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/${user._id}/addresses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Address Added");

        setForm({
          fullName: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        });

        fetchAddresses();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-10 px-5">

        <h1 className="text-4xl font-bold mb-8">
          📍 My Addresses
        </h1>

        <div className="bg-white shadow-xl rounded-xl p-8">

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="border p-3 rounded-lg md:col-span-2"
            />

            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

          </div>

          <button
            onClick={addAddress}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            ➕ Add Address
          </button>

        </div>
                {/* Address List */}

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          {addresses.length > 0 ? (

            addresses.map((item) => (

              <div
                key={item._id}
                className="bg-white shadow-xl rounded-xl p-6"
              >

                <h2 className="text-xl font-bold">
                  {item.fullName}
                </h2>

                <p className="mt-2">
                  📞 {item.phone}
                </p>

                <p className="mt-2">
                  📍 {item.address}
                </p>

                <p>
                  {item.city}, {item.state}
                </p>

                <p>
                  {item.pincode}
                </p>

                <p>
                  {item.country}
                </p>

                <div className="flex gap-3 mt-5">

                  <button
                    onClick={() =>
                      alert(
                        "Edit Address feature will be added next."
                      )
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={async () => {
                      if (
                        !confirm("Delete this address?")
                      )
                        return;

                      try {
                        const res = await fetch(
                          `http://localhost:5000/api/users/${user._id}/addresses/${item._id}`,
                          {
                            method: "DELETE",
                          }
                        );

                        const data = await res.json();

                        if (data.success) {
                          toast.success("Address Deleted");
                          fetchAddresses();
                        } else {
                          toast.error(data.message);
                        }
                      } catch (err) {
                        console.log(err);
                        toast.error("Server Error");
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            ))

          ) : (

            <div className="col-span-2 text-center py-10 text-gray-500 text-lg">
              No Address Found
            </div>

          )}

        </div>

      </div>
    </ProtectedRoute>
  );
}