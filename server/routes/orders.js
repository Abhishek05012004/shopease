const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/auth");
const { sendOrderConfirmation, sendOrderCancellation } = require("../utils/mailer"); // added

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      contactEmail,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: "No order items" });
      return;
    }

    // Verify products exist and have sufficient stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404).json({ message: `Product not found: ${item.name}` });
        return;
      }
      if (product.stock < item.quantity) {
        res
          .status(400)
          .json({ message: `Insufficient stock for ${item.name}` });
        return;
      }
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      contactEmail: contactEmail || req.user?.email, // save email
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Update product stock and sold count
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          sold: item.quantity,
        },
      });
    }

    if (paymentMethod === "Cash on Delivery") {
      try {
        await sendOrderConfirmation({
          to: createdOrder.contactEmail,
          order: createdOrder,
        });
      } catch (e) {
        console.error("Failed to send COD order email:", e.message);
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/orders
// @desc    Get logged in user orders
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID (supports 24-character full ID or 8-character suffix ID)
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    let order;
    const isHex24 = req.params.id.match(/^[0-9a-fA-F]{24}$/);

    if (req.params.id.length === 8) {
      // Find the order suffix match among the user's orders (or all orders if admin)
      let query = {};
      if (req.user.role !== "admin") {
        query.user = req.user._id;
      }
      const orders = await Order.find(query).populate("user", "name email");
      order = orders.find(
        (o) => o._id.toString().slice(-8).toLowerCase() === req.params.id.toLowerCase()
      );
    } else if (isHex24) {
      order = await Order.findById(req.params.id).populate("user", "name email");
    }

    if (order) {
      // Check if user owns this order or is admin
      if (
        order.user._id.toString() === req.user._id.toString() ||
        req.user.role === "admin"
      ) {
        res.json(order);
      } else {
        res.status(401).json({ message: "Not authorized to view this order" });
      }
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Check if user owns this order
      if (order.user.toString() !== req.user._id.toString()) {
        res
          .status(401)
          .json({ message: "Not authorized to update this order" });
        return;
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();

      try {
        await sendOrderConfirmation({
          to: updatedOrder.contactEmail,
          order: updatedOrder,
        });
      } catch (e) {
        console.error("Failed to send payment confirmation email:", e.message);
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/orders/:id/deliver
// @desc    Update order to delivered
// @access  Private/Admin
router.put("/:id/deliver", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.status = "Delivered";

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log(
      `[v0] Updating order ${req.params.id} status from ${order.status} to ${status}`
    );

    if (status === "Cancelled") {
      order.cancelledFromStatus = order.status;
    }

    order.status = status;
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    console.log(
      `[v0] Successfully updated order ${req.params.id} status to ${status}`
    );

    if (status === "Cancelled") {
      try {
        await sendOrderCancellation({
          to: updatedOrder.contactEmail,
          order: updatedOrder,
        });
      } catch (e) {
        console.error("Failed to send order cancellation email:", e.message);
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error(`[v0] Error updating order status:`, error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        details: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin)
// @access  Private/Admin
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
