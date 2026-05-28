const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get("/", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build query object
    const query = { isActive: true };

    // Category filter (supports comma-separated list for multiple categories)
    if (req.query.category) {
      const categories = req.query.category.split(",");
      query.category = { $in: categories };
    }

    // Brand filter (supports comma-separated list for multiple brands)
    if (req.query.brand) {
      const brands = req.query.brand.split(",");
      query.brand = { $in: brands };
    }

    // Price range filter (supports comma-separated list of multiple price ranges)
    if (req.query.minPrice || req.query.maxPrice) {
      const minPrices = req.query.minPrice ? req.query.minPrice.split(",") : [];
      const maxPrices = req.query.maxPrice ? req.query.maxPrice.split(",") : [];
      
      const priceOrConditions = [];
      const length = Math.max(minPrices.length, maxPrices.length);
      for (let i = 0; i < length; i++) {
        const cond = {};
        const minVal = minPrices[i];
        const maxVal = maxPrices[i];
        if (minVal) cond.$gte = Number.parseFloat(minVal);
        if (maxVal) cond.$lte = Number.parseFloat(maxVal);
        priceOrConditions.push({ price: cond });
      }
      if (priceOrConditions.length > 0) {
        query.$or = query.$or ? [...query.$or, ...priceOrConditions] : priceOrConditions;
      }
    }

    // Search functionality
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Rating filter (supports comma-separated list for multiple ratings, takes minimum)
    if (req.query.rating) {
      const ratings = req.query.rating.split(",").map(Number);
      const minRating = Math.min(...ratings);
      query.rating = { $gte: minRating };
    }

    // Build sort object
    const sort = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case "price-low":
          sort.price = 1;
          break;
        case "price-high":
          sort.price = -1;
          break;
        case "rating":
          sort.rating = -1;
          break;
        case "popular":
          sort.numReviews = -1;
          break;
        case "newest":
          sort.createdAt = -1;
          break;
        default:
          sort.createdAt = -1;
      }
    } else {
      sort.numReviews = -1;
    }

    const products = await Product.find(query)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .select("-reviews");
    const total = await Product.countDocuments(query);

    const productCounts = {
      categories: {},
      brands: {},
      priceRanges: {},
      ratings: {},
    };

    // Get category counts
    const categoryAggregation = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    categoryAggregation.forEach((item) => {
      productCounts.categories[item._id] = item.count;
    });

    // Get brand counts
    const brandAggregation = await Product.aggregate([
      { $match: { isActive: true, brand: { $exists: true, $ne: null } } },
      { $group: { _id: "$brand", count: { $sum: 1 } } },
    ]);
    brandAggregation.forEach((item) => {
      productCounts.brands[item._id] = item.count;
    });

    // Get price range counts
    const priceAggregation = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 2000, 5000, 10000, 20000, Number.MAX_VALUE],
          default: "other",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    productCounts.priceRanges = {
      under2000: priceAggregation.find((p) => p._id === 0)?.count || 0,
      "2000-5000": priceAggregation.find((p) => p._id === 2000)?.count || 0,
      "5000-10000": priceAggregation.find((p) => p._id === 5000)?.count || 0,
      "10000-20000": priceAggregation.find((p) => p._id === 10000)?.count || 0,
      over20000: priceAggregation.find((p) => p._id === 20000)?.count || 0,
    };

    // Get rating counts
    const ratingAggregation = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $bucket: {
          groupBy: "$rating",
          boundaries: [0, 1, 2, 3, 4, 5],
          default: "other",
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    productCounts.ratings = {
      "1+": ratingAggregation
        .filter((r) => r._id >= 1)
        .reduce((sum, r) => sum + r.count, 0),
      "2+": ratingAggregation
        .filter((r) => r._id >= 2)
        .reduce((sum, r) => sum + r.count, 0),
      "3+": ratingAggregation
        .filter((r) => r._id >= 3)
        .reduce((sum, r) => sum + r.count, 0),
      "4+": ratingAggregation
        .filter((r) => r._id >= 4)
        .reduce((sum, r) => sum + r.count, 0),
    };

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      productCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .limit(8)
      .select("-reviews");
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews.user",
      "name"
    );

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      category: req.body.category,
      subcategory: req.body.subcategory,
      brand: req.body.brand,
      images: req.body.images,
      stock: req.body.stock,
      tags: req.body.tags,
      specifications: req.body.specifications,
      featured: req.body.featured,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/products/:id/reviews
// @desc    Create new review
// @access  Private
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ message: "Product already reviewed" });
        return;
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/products/:id/reviews/:reviewId
// @desc    Delete a review
// @access  Private
router.delete("/:id/reviews/:reviewId", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const reviewIndex = product.reviews.findIndex(
        (r) => r._id.toString() === req.params.reviewId
      );

      if (reviewIndex === -1) {
        return res.status(404).json({ message: "Review not found" });
      }

      const review = product.reviews[reviewIndex];

      // Check if user owns the review or is admin
      if (
        review.user.toString() === req.user._id.toString() ||
        req.user.role === "admin"
      ) {
        product.reviews.splice(reviewIndex, 1);
        product.numReviews = product.reviews.length;
        
        if (product.reviews.length > 0) {
          product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;
        } else {
          product.rating = 0;
        }

        await product.save();
        return res.json({ message: "Review deleted successfully" });
      } else {
        return res.status(401).json({ message: "Not authorized to delete this review" });
      }
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
