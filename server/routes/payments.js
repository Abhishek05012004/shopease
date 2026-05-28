const express = require("express");
const { protect } = require("../middleware/auth");
const Order = require("../models/Order");
const { sendOrderConfirmation } = require("../utils/mailer");

const router = express.Router();
const CF_VERSION = "2022-09-01";

router.post("/cashfree/order", protect, async (req, res) => {
  try {
    const { amount, currency = "INR", customerEmail, customerPhone, orderId: customOrderId } = req.body;
    if (!amount || !customerEmail) {
      return res
        .status(400)
        .json({ message: "amount and customerEmail are required" });
    }

    const baseUrl =
      false
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";

    const orderId = customOrderId || `order_${Date.now()}`;
    const body = {
      order_id: orderId,
      order_amount: Number(amount),
      order_currency: currency,
      customer_details: {
        customer_id: `${req.user._id}`,
        customer_email: customerEmail,
        customer_phone: customerPhone || "",
      },
      order_meta: {
        return_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/checkout/verify?order_id={order_id}`,
      },
    };

    const resp = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": process.env.CASHFREE_APP_ID || "",
        "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
        "x-api-version": CF_VERSION,
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json({
        message: data.message || "Cashfree order create failed",
        data,
      });
    }
    return res.json(data);
  } catch (e) {
    console.error("Cashfree create order error:", e);
    res.status(500).json({ message: "Cashfree error", error: e.message });
  }
});

// GET /api/payments/cashfree/verify/:orderId
router.get("/cashfree/verify/:orderId", protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const baseUrl =
      false
        ? "https://api.cashfree.com/pg"
        : "https://sandbox.cashfree.com/pg";

    const resp = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "x-client-id": process.env.CASHFREE_APP_ID || "",
        "x-client-secret": process.env.CASHFREE_SECRET_KEY || "",
        "x-api-version": CF_VERSION,
      },
    });

    const data = await resp.json();
    if (!resp.ok) {
      return res.status(resp.status).json({
        message: data.message || "Failed to fetch order status from Cashfree",
      });
    }

    if (data.order_status === "PAID") {
      // Find the order in our database
      const order = await Order.findById(orderId);
      if (order) {
        if (!order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = {
            id: data.cf_order_id,
            status: "PAID",
            update_time: new Date().toISOString(),
            email_address: order.contactEmail,
          };
          await order.save();

          // Update product stock and sold count upon successful payment
          const Product = require("../models/Product");
          for (const item of order.orderItems) {
            await Product.findByIdAndUpdate(item.product, {
              $inc: {
                stock: -item.quantity,
                sold: item.quantity,
              },
            });
          }

          try {
            await sendOrderConfirmation({
              to: order.contactEmail,
              order: order,
            });
          } catch (e) {
            console.error("Failed to send payment confirmation email:", e.message);
          }
        }
        return res.json({ status: "PAID", order });
      }
    } else {
      // Payment failed or was cancelled, delete unpaid order and restore stock
      const order = await Order.findById(orderId);
      if (order && !order.isPaid) {
        const Product = require("../models/Product");
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: {
              stock: item.quantity,
              sold: -item.quantity,
            },
          });
        }
        await Order.findByIdAndDelete(orderId);
      }
    }

    return res.json({ status: data.order_status });
  } catch (e) {
    console.error("Cashfree verify error:", e);
    res.status(500).json({ message: "Verification error", error: e.message });
  }
});

module.exports = router;
