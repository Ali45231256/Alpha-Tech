const express = require("express");

const {
  getProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  addReview,
} = require("../controllers/productController");

const router = express.Router();

// Products
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

router.post("/", addProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

// Review
router.post("/review", addReview);

module.exports = router;