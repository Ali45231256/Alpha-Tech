require("dotenv").config();

const express = require("express");
const cors = require("cors");
const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

// =====================
// Database Connection
// =====================
const connectDB = require("./config/db");
connectDB();

// =====================
// Middlewares
// =====================
app.use(cors());
app.use(express.json());

// =====================
// Import Routes
// =====================
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const couponRoutes = require("./routes/couponRoutes");

// Debug
console.log("Auth Routes =", authRoutes);

// =====================
// API Routes
// =====================
app.use("/api/auth", (req, res, next) => {
  console.log("AUTH ROUTE HIT:", req.method, req.originalUrl);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/coupons", couponRoutes);

// =====================
// Test Route
// =====================
app.get("/api/auth/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth Route Working",
  });
});

// =====================
// Home Route
// =====================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Alpha Tech Backend Running Successfully",
  });
});

// =====================
// 404 Route
// =====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// =====================
// Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on http://localhost:${PORT}`);
});