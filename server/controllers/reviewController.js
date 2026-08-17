const Review = require("../models/Review");
const Product = require("../models/Product");

// Add Review
exports.addReview = async (req, res) => {
  try {
    const {
      product,
      user,
      name,
      rating,
      comment,
    } = req.body;

    const review = await Review.create({
      product,
      user,
      name,
      rating,
      comment,
    });

    // Update Product Average Rating
    const reviews = await Review.find({ product });

    const avgRating =
      reviews.reduce(
        (sum, item) => sum + item.rating,
        0
      ) / reviews.length;

    await Product.findByIdAndUpdate(product, {
      rating: avgRating.toFixed(1),
    });

    res.status(201).json({
      success: true,
      review,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Product Reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};