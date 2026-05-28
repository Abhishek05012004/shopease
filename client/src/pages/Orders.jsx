"use client";

import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { Package, Calendar, Truck } from "lucide-react";
import { ordersAPI } from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const Orders = () => {
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery("userOrders", ordersAPI.getOrders);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "Processing":
        return "bg-blue-500/20 text-blue-400";
      case "Shipped":
        return "bg-purple-500/20 text-purple-400";
      case "Delivered":
        return "bg-emerald-500/20 text-emerald-400";
      case "Cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-red-400">
              Error loading orders. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-6">My Orders</h1>

        {orders?.data?.length === 0 ? (
          <div className="text-center py-16">
            <Package className="mx-auto h-20 w-20 text-slate-400 mb-4" />
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              No orders yet
            </h2>
            <p className="text-slate-300 text-sm mb-8">
              When you place your first order, it will appear here.
            </p>
            <Link
              to="/products"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders?.data?.map((order) => (
              <div
                key={order._id}
                className="bg-slate-700 rounded-lg shadow-sm border border-slate-600 overflow-hidden"
              >
                {/* Order Header */}
                <div className="px-6 py-4 bg-slate-700 border-b border-slate-600">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white">
                          Order <span className="text-yellow-400">#{order._id.slice(-8)}</span>
                        </h3>
                        <div className="flex items-center space-x-4 text-xs sm:text-sm text-slate-300 mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">₹</span>
                            <span className="text-slate-200">
                              {order.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <Link
                        to={`/orders/${order._id}`}
                        className="btn-outline text-xs sm:text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.orderItems.slice(0, 3).map((item) => {
                      const qty = item.quantity ?? item.qty ?? 1;
                      const name = item.name || "Product";
                      const imageSrc =
                        item.image ||
                        `/placeholder.svg?height=60&width=60&query=${encodeURIComponent(
                          name
                        )}`;

                      return (
                        <div key={item._id} className="flex items-start gap-4">
                          {/* fixed columns for alignment */}
                          <div className="w-16 shrink-0">
                            <img
                              src={imageSrc || "/placeholder.svg"}
                              alt={name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-semibold text-white break-normal leading-tight">
                                {name}
                              </h4>
                              <div className="flex flex-wrap gap-x-3 text-xs text-slate-400 mt-1">
                                <span>Qty: {qty}</span>
                                <span className="hidden sm:inline text-slate-600">|</span>
                                <span>Price: ₹{item.price.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="sm:w-24 sm:shrink-0 sm:text-right mt-1 sm:mt-0">
                              <p className="text-sm font-semibold text-slate-100">
                                <span className="inline sm:hidden text-slate-400 text-xs font-normal mr-1">Total:</span>
                                ₹{(item.price * qty).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {order.orderItems.length > 3 && (
                      <p className="text-sm text-slate-300">
                        +{order.orderItems.length - 3} more item
                        {order.orderItems.length - 3 !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-slate-700 border-t border-slate-600">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-300">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center">
                        <Truck className="h-4 w-4 mr-1.5 text-slate-400 shrink-0" />
                        <span>
                          {order.isDelivered
                            ? `Delivered on ${formatDate(order.deliveredAt)}`
                            : "Not delivered yet"}
                        </span>
                      </div>
                      <div className="flex items-center sm:before:content-['|'] sm:before:mr-4 sm:before:text-slate-500">
                        <span>Payment: {order.isPaid ? "Paid" : "Pending"}</span>
                      </div>
                    </div>
                    <div className="flex items-center sm:justify-end border-t border-slate-600 pt-2.5 sm:border-0 sm:pt-0">
                      <span className="text-slate-300 mr-1.5">Total:</span>
                      <span className="font-semibold text-yellow-400 text-base">
                        ₹{order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
