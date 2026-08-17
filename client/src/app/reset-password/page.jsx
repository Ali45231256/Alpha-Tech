"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("resetEmail")
      : "";

  const otp =
    typeof window !== "undefined"
      ? localStorage.getItem("resetOtp")
      : "";

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          password,
        }),
      });

      const data = await res.json();

      alert(data.message);

      if (data.success) {
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetOtp");

        router.push("/login");
      }

    } catch (err) {
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-5">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="Enter New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-3 rounded mb-4"
          required
        />

        <button
          className="bg-blue-600 text-white w-full p-3 rounded"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

      </form>

    </div>
  );
}