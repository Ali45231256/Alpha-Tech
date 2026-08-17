"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute/ProtectedRoute";
import toast from "react-hot-toast";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const changePassword = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/change-password/${user._id}`,
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
        toast.success("Password Changed Successfully");
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
      <div className="max-w-lg mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-6">🔒 Change Password</h1>

        <div className="bg-white shadow-xl rounded-xl p-6">

          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={form.oldPassword}
            onChange={handleChange}
            className="border p-3 rounded w-full mb-4"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="border p-3 rounded w-full mb-6"
          />

          <button
            onClick={changePassword}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
          >
            Change Password
          </button>

        </div>
      </div>
    </ProtectedRoute>
  );
}