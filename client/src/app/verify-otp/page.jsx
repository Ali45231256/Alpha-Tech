"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtp() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("resetEmail")
      : "";

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      alert(data.message);

      if (data.success) {
        localStorage.setItem("resetOtp", otp);
        router.push("/reset-password");
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
          Verify OTP
        </h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border w-full p-3 rounded mb-4"
          required
        />

        <button
          className="bg-green-600 text-white w-full p-3 rounded"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </form>

    </div>
  );
}