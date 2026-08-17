"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        setLoading(false);
        return;
      }

      login(data.user, data.token);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      toast.success("✅ Login Successful");

      if (data.user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server Error");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "80px auto",
        border: "1px solid #ddd",
        padding: "25px",
        borderRadius: "10px",
        background: "#fff",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Login
      </h2>

      <form onSubmit={loginUser}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "15px",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
          }}
        />

        {/* Forgot Password Link */}
        <div
          style={{
            textAlign: "right",
            marginBottom: "20px",
          }}
        >
          <Link
            href="/forgot-password"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        Don't have an account?{" "}
        <Link
          href="/register"
          style={{
            color: "#2563eb",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Register
        </Link>
      </p>
    </div>
  );
}