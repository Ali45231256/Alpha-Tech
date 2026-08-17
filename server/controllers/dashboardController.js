const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

exports.getDashboard = async (req, res) => {
  try {
   const totalProducts = await Product.countDocuments();
const totalOrders = await Order.countDocuments();
const totalUsers = await User.countDocuments();

    const orders = await Order.find()
      .populate("user")
      .sort({ createdAt: -1 });

    // =====================
    // Total Revenue
    // =====================
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    // =====================
    // Today's Revenue
    // =====================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayRevenue = orders
      .filter((o) => new Date(o.createdAt) >= today)
      .reduce((sum, o) => sum + o.totalPrice, 0);

    // =====================
    // Monthly Revenue
    // =====================
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyRevenue = orders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return (
          d.getMonth() === currentMonth &&
          d.getFullYear() === currentYear
        );
      })
      .reduce((sum, o) => sum + o.totalPrice, 0);

    // =====================
    // Recent Orders
    // =====================
    const recentOrders = orders.slice(0, 5);

    // =====================
    // Monthly Sales Graph
    // =====================
    const monthlySales = [
      { month: "Jan", sales: 0 },
      { month: "Feb", sales: 0 },
      { month: "Mar", sales: 0 },
      { month: "Apr", sales: 0 },
      { month: "May", sales: 0 },
      { month: "Jun", sales: 0 },
      { month: "Jul", sales: 0 },
      { month: "Aug", sales: 0 },
      { month: "Sep", sales: 0 },
      { month: "Oct", sales: 0 },
      { month: "Nov", sales: 0 },
      { month: "Dec", sales: 0 },
    ];

    orders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth();
      monthlySales[month].sales += order.totalPrice;
    });

    // =====================
    // Orders by Status
    // =====================
    const orderStatus = {
      Pending: 0,
      Confirmed: 0,
      Packed: 0,
      Shipped: 0,
      "Out For Delivery": 0,
      Delivered: 0,
      Cancelled: 0,
    };

    orders.forEach((order) => {
      if (orderStatus[order.orderStatus] !== undefined) {
        orderStatus[order.orderStatus]++;
      }
    });

    // =====================
    // Top Selling Products
    // =====================
    const productSales = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productSales[item.name]) {
          productSales[item.name] = 0;
        }

        productSales[item.name] += item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([name, sold]) => ({
        name,
        sold,
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    // =====================
    // Top Customers
    // =====================
    const customerSales = {};

    orders.forEach((order) => {
      const customer =
        order.shippingAddress?.fullName || "Unknown";

      if (!customerSales[customer]) {
        customerSales[customer] = 0;
      }

      customerSales[customer] += order.totalPrice;
    });

    const topCustomers = Object.entries(customerSales)
      .map(([name, spent]) => ({
        name,
        spent,
      }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);

    res.json({
      success: true,

      totalRevenue,
      todayRevenue,
      monthlyRevenue,

      totalOrders,
      totalProducts,
      totalUsers,

      recentOrders,

      monthlySales,

      orderStatus,

      topProducts,

      topCustomers,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};