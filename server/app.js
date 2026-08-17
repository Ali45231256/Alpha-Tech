const invoiceRoutes = require("./routes/invoiceRoutes");
app.use("/api/invoice", invoiceRoutes);
const couponRoutes = require("./routes/couponRoutes");
app.use("/api/coupons", couponRoutes);
