const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const { protect, admin } = require("../middleware/auth");

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
router.get("/dashboard", protect, admin, async (req, res) => {
  try {
    const { period = "30" } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number.parseInt(period));

    // Total counts
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalOrders = await Order.countDocuments();

    // Recent metrics
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: daysAgo },
    });

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: daysAgo },
      role: "customer",
    });

    // Revenue calculations
    const revenueData = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
        },
      },
    ]);

    const revenue = revenueData[0] || { totalRevenue: 0, averageOrderValue: 0 };

    // Top selling products
    const topProducts = await Product.find({ isActive: true })
      .sort({ sold: -1 })
      .limit(5)
      .select("name sold price images");

    // Low stock products
    const lowStockProducts = await Product.find({
      isActive: true,
      stock: { $lte: 10, $gt: 0 },
    })
      .sort({ stock: 1 })
      .select("name stock category");

    // Out of stock products
    const outOfStockCount = await Product.countDocuments({
      isActive: true,
      stock: 0,
    });

    // Sales by category
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalSold: { $sum: "$sold" },
          averageRating: { $avg: "$rating" },
        },
      },
      { $sort: { totalSold: -1 } },
    ]);

    res.json({
      overview: {
        totalProducts,
        totalUsers,
        totalOrders,
        recentOrders,
        recentUsers,
        totalRevenue: revenue.totalRevenue,
        averageOrderValue: revenue.averageOrderValue,
        outOfStockCount,
      },
      topProducts,
      lowStockProducts,
      categoryStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get sales analytics
// @route   GET /api/analytics/sales
// @access  Private/Admin
router.get("/sales", protect, admin, async (req, res) => {
  try {
    const { period = "30" } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number.parseInt(period));

    // Daily sales data
    const dailySales = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          sales: { $sum: "$totalAmount" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Order status distribution
    const orderStatusStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      dailySales,
      orderStatusStats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
