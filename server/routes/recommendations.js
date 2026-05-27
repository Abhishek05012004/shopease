const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc    Get product recommendations
// @route   GET /api/recommendations/:productId
// @access  Public
router.get("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const currentProduct = await Product.findById(productId);

    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get related products by category and tags
    const relatedProducts = await Product.find({
      _id: { $ne: productId },
      isActive: true,
      $or: [
        { category: currentProduct.category },
        { tags: { $in: currentProduct.tags } },
        { brand: currentProduct.brand },
      ],
    })
      .sort({ rating: -1, sold: -1 })
      .limit(8);

    res.json(relatedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get frequently bought together
// @route   GET /api/recommendations/bought-together/:productId
// @access  Public
router.get("/bought-together/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // Find orders that contain this product
    const orders = await Order.find({
      "items.product": productId,
    }).populate("items.product");

    // Count frequency of other products in these orders
    const productFrequency = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const otherProductId = item.product._id.toString();
        if (otherProductId !== productId) {
          productFrequency[otherProductId] =
            (productFrequency[otherProductId] || 0) + 1;
        }
      });
    });

    // Sort by frequency and get top products
    const sortedProducts = Object.entries(productFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([productId]) => productId);

    const boughtTogetherProducts = await Product.find({
      _id: { $in: sortedProducts },
      isActive: true,
    });

    res.json(boughtTogetherProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get trending products
// @route   GET /api/recommendations/trending
// @access  Public
router.get("/trending", async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get products with high recent sales
    const trendingProducts = await Product.find({
      isActive: true,
      updatedAt: { $gte: thirtyDaysAgo },
    })
      .sort({ sold: -1, rating: -1 })
      .limit(12);

    res.json(trendingProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
