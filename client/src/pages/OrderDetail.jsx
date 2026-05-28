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

  const formatDateTimeSplit = (dateString) => {
    const d = new Date(dateString);
    const datePart = d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const timePart = d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { datePart, timePart };
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
        <div className="bg-slate-700 rounded-lg shadow-sm p-4 sm:p-6 mb-6 border border-slate-600">
          <div className="flex flex-row items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-sm sm:text-2xl font-bold text-white flex flex-wrap items-center gap-1.5 leading-none">
                <span>Order</span>
                <span className="text-yellow-400">#{order._id.slice(-8)}</span>
              </h1>
              <p className="text-[10px] sm:text-sm text-slate-300 mt-1 leading-normal">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <span
              className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-sm font-medium shrink-0 ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>

          <Link
            to="/orders"
            className="text-[10px] sm:text-sm text-yellow-400 hover:text-yellow-300 font-medium"
          >
            ← Back to Orders
          </Link>
        </div>

        {/* Quality Check & Final Sale Notice Banner */}
        <div className="bg-slate-700 border-l-4 border-yellow-500 text-slate-100 p-5 rounded-r-lg shadow-sm mb-6 border border-slate-600 border-l-0">
          <div className="flex gap-3">
            <div className="shrink-0 mt-0.5">
              <svg className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Customer Service & Final Sale Notice</h3>
              <p className="text-sm text-slate-300 mt-1">
                To guarantee zero defects and maintain premium standards, all items undergo multi-point quality assurance checks before packaging. Consequently, <strong className="text-white">orders are final and cannot be cancelled, returned, or exchanged</strong>.
              </p>
            </div>
          </div>
        </div>        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Items & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
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
                      className="flex items-start gap-4 p-4 border border-slate-600 rounded-lg"
                    >
                      {/* fixed columns for alignment */}
                      <div className="w-20 shrink-0">
                        <img
                          src={imageSrc || "/placeholder.svg"}
                          alt={name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base text-white break-normal leading-tight">
                            {name}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 text-xs text-slate-400 mt-1">
                            <span>Qty: {qty}</span>
                            <span className="hidden sm:inline text-slate-600">|</span>
                            <span>Price: ₹{item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="sm:w-24 sm:shrink-0 sm:text-right mt-1 sm:mt-0">
                          <p className="font-semibold text-white text-sm sm:text-base">
                            <span className="inline sm:hidden text-slate-400 text-xs font-normal mr-1">Total:</span>
                            ₹{(item.price * qty).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Logistics & Order Metadata */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-slate-700 rounded-lg shadow-sm p-6 border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
                  <span className="w-1 h-5 bg-yellow-500 rounded-full inline-block"></span>
                  Shipping Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline gap-2 w-full">
                      <span className="text-slate-400 font-medium">Recipient Name:</span>
                      <span className="text-white font-semibold text-right break-all">{order.shippingAddress.fullName}</span>
                    </div>
                    <div className="flex justify-between items-baseline gap-2 w-full">
                      <span className="text-slate-400 font-medium text-left">Street Address:</span>
                      <span className="text-white text-right break-all max-w-[60%]">{order.shippingAddress.address}</span>
                    </div>
                    <div className="flex justify-between items-baseline gap-2 w-full">
                      <span className="text-slate-400 font-medium">City:</span>
                      <span className="text-white text-right">{order.shippingAddress.city}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline gap-2 w-full">
                      <span className="text-slate-400 font-medium">ZIP Code:</span>
                      <span className="text-white text-right">{order.shippingAddress.postalCode}</span>
                    </div>
                    <div className="flex justify-between items-baseline gap-2 w-full">
                      <span className="text-slate-400 font-medium">State:</span>
                      <span className="text-white text-right">{order.shippingAddress.state || "-"}</span>
                    </div>
                    <div className="flex justify-between items-baseline gap-2 w-full">
                      <span className="text-slate-400 font-medium">Country:</span>
                      <span className="text-white text-right">{order.shippingAddress.country}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-slate-700 rounded-lg shadow-sm p-6 border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
                  <span className="w-1 h-5 bg-yellow-500 rounded-full inline-block"></span>
                  Payment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <div className="flex justify-between items-baseline gap-2 w-full">
                      <span className="text-slate-400 font-medium">Method:</span>
                      <span className="text-white font-semibold text-right">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-baseline gap-2 w-full">
                      <span className="text-slate-400 font-medium">Status:</span>
                      <span className={`font-semibold text-right ${order.isPaid ? "text-emerald-400" : "text-red-400"}`}>
                        {order.isPaid ? "Paid" : "Not Paid"}
                      </span>
                    </div>
                    {order.isPaid && order.paidAt && (
                      <div className="flex justify-between items-start gap-2 w-full pt-1">
                        <span className="text-slate-400 font-medium">Transaction Date:</span>
                        <div className="text-right text-white font-medium flex flex-col items-end">
                          <span>{formatDateTimeSplit(order.paidAt).datePart}</span>
                          <span className="text-xs text-slate-400">{formatDateTimeSplit(order.paidAt).timePart}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-slate-700 rounded-lg shadow-sm p-6 border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
                  <span className="w-1 h-5 bg-yellow-500 rounded-full inline-block"></span>
                  Delivery Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-300">
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <div className="flex justify-between items-baseline gap-2 w-full">
                      <span className="text-slate-400 font-medium">Status:</span>
                      <span className={`font-semibold text-right ${order.isDelivered ? "text-emerald-400" : "text-yellow-400"}`}>
                        {order.status}
                      </span>
                    </div>
                    {order.isDelivered && order.deliveredAt && (
                      <div className="flex justify-between items-start gap-2 w-full pt-1">
                        <span className="text-slate-400 font-medium">Delivered On:</span>
                        <div className="text-right text-white font-medium flex flex-col items-end">
                          <span>{formatDateTimeSplit(order.deliveredAt).datePart}</span>
                          <span className="text-xs text-slate-400">{formatDateTimeSplit(order.deliveredAt).timePart}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1 lg:sticky lg:top-[140px] h-fit">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
