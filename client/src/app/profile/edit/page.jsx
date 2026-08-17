"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute/ProtectedRoute";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    password: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setForm({
        name: user.name,
        password: "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch(
  `http://localhost:5000/api/users/profile/${user._id}`,
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  }
);

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));

        toast.success("Profile Updated Successfully");

        router.push("/profile");
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
      <div className="max-w-xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          ✏️ Edit Profile
        </h1>

        <div className="bg-white shadow-xl rounded-xl p-8">

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter Name"
            className="border p-3 rounded w-full mb-5"
          />

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="New Password (Optional)"
            className="border p-3 rounded w-full mb-5"
          />

          <button
            onClick={updateProfile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            Save Changes
          </button>

        </div>
      </div>
    </ProtectedRoute>
  );
}