const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const { protect } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "wishlist",
      "name price originalPrice images category brand stock rating numReviews"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ items: user.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/wishlist/items
// @desc    Add item to wishlist
// @access  Private
router.post("/items", protect, async (req, res) => {
  try {
    const { productId } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if item already exists in wishlist
    if (user.wishlist.some(id => id.toString() === productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Add to wishlist using atomic $addToSet to prevent duplicates under concurrent requests
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate(
      "wishlist",
      "name price originalPrice images category brand stock rating numReviews"
    );

    res.json({ items: updatedUser.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/wishlist/items/:productId
// @desc    Remove item from wishlist
// @access  Private
router.delete("/items/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(
      (item) => item.toString() !== productId
    );
    await user.save();

    // Return updated wishlist
    const updatedUser = await User.findById(req.user._id).populate(
      "wishlist",
      "name price originalPrice images category brand stock rating numReviews"
    );

    res.json({ items: updatedUser.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/wishlist
// @desc    Clear wishlist
// @access  Private
router.delete("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = [];
    await user.save();

    res.json({ items: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
