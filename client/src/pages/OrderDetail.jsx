"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ordersAPI } from "../services/api";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrder(id);
      setOrder(response.data);
    } catch (error) {
      setError("Failed to fetch order details");
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-400 bg-yellow-500/20";
      case "Processing":
        return "text-blue-400 bg-blue-500/20";
      case "Shipped":
        return "text-purple-400 bg-purple-500/20";
      case "Delivered":
        return "text-emerald-400 bg-emerald-500/20";
      case "Cancelled":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-slate-300 bg-slate-500/20";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Order Not Found
          </h2>
          <p className="text-slate-300 mb-6">
            {error || "The order you are looking for does not exist."}
          </p>
          <Link
            to="/orders"
            className="bg-yellow-500 text-slate-900 px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-slate-700 rounded-lg shadow-sm p-6 mb-6 border border-slate-600">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Order #{order._id.slice(-8)}
              </h1>
              <p className="text-slate-300">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          <Link
            to="/orders"
            className="text-yellow-400 hover:text-yellow-300 font-medium"
          >
            ← Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 lg:sticky lg:top-[140px] h-fit">
            <div className="bg-slate-700 rounded-lg shadow-sm p-6 border border-slate-600">
              <h2 className="text-lg font-semibold text-white mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.orderItems.map((item) => {
                  const name = item.name || "Product";
                  const qty = item.quantity ?? item.qty ?? 1;
                  const imageSrc =
                    item.image ||
                    `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(
                      name
                    )}`;
                  return (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 border border-slate-600 rounded-lg"
                    >
                      {/* fixed columns for alignment */}
                      <div className="w-20 shrink-0">
                        <img
                          src={imageSrc || "/placeholder.svg"}
                          alt={name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">
                          {name}
                        </h3>
                        <p className="text-slate-300">Quantity: {qty}</p>
                        <p className="text-slate-300">Price: ₹{item.price}</p>
                      </div>
                      <div className="w-28 text-right">
                        <p className="font-semibold text-white">
                          ₹{(item.price * qty).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary & Details */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-slate-700 rounded-lg shadow-sm p-6 border border-slate-600">
              <h2 className="text-lg font-semibold text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 text-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-300">Subtotal:</span>
                  <span className="font-medium">
                    ₹{order.itemsPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Shipping:</span>
                  <span className="font-medium">
                    ₹{order.shippingPrice.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-slate-600 pt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-white">
                      Total:
                    </span>
                    <span className="text-lg font-semibold text-yellow-400">
                      ₹{order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-slate-700 rounded-lg shadow-sm p-6 border border-slate-600">
              <h2 className="text-lg font-semibold text-white mb-4">
                Shipping Address
              </h2>
              <div className="text-slate-300">
                <p className="font-medium text-white">
                  {order.shippingAddress.fullName}
                </p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-slate-700 rounded-lg shadow-sm p-6 border border-slate-600">
              <h2 className="text-lg font-semibold text-white mb-4">
                Payment Information
              </h2>
              <div className="space-y-2 text-slate-300">
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium text-white">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status:</span>
                  <span
                    className={`font-medium ${
                      order.isPaid ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Not Paid"}
                  </span>
                </div>
                {order.isPaid && order.paidAt && (
                  <div className="flex justify-between">
                    <span>Paid At:</span>
                    <span className="font-medium text-white">
                      {formatDate(order.paidAt)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            {order.isDelivered && (
              <div className="bg-slate-700 rounded-lg shadow-sm p-6 border border-slate-600">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Delivery Information
                </h2>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span>Delivery Status:</span>
                    <span className="font-medium text-emerald-400">
                      Delivered
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivered At:</span>
                    <span className="font-medium text-white">
                      {formatDate(order.deliveredAt)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
