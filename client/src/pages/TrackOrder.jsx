import { useState } from "react";
import { Search, Package, CheckCircle2, Truck, ClipboardList, Clock, XCircle } from "lucide-react";
import { ordersAPI } from "../services/api";
import toast from "react-hot-toast";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    const cleanedId = orderId.trim().replace(/^#/, "");
    if (!cleanedId) {
      toast.error("Please enter a valid Order ID");
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setOrderData(null);
    try {
      const res = await ordersAPI.getOrder(cleanedId);
      if (res.data && typeof res.data === "object" && !Array.isArray(res.data) && res.data._id) {
        setOrderData(res.data);
      } else {
        setOrderData(null);
        toast.error("Order not found. Please verify the ID and try again.");
      }
    } catch (err) {
      console.error(err);
      setOrderData(null);
      toast.error("Order not found. Please verify the ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (currentStatus, step) => {
    if (currentStatus === "Cancelled") {
      if (step === "Cancelled") return "cancelled";
      return "completed";
    }

    const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
    const currentIdx = statuses.indexOf(currentStatus);
    const stepIdx = statuses.indexOf(step);

    if (stepIdx < currentIdx) return "completed";
    if (stepIdx === currentIdx) return "active";
    return "upcoming";
  };

  let steps = [
    { label: "Order Placed", statusKey: "Pending", icon: ClipboardList },
    { label: "Processing", statusKey: "Processing", icon: Clock },
    { label: "Dispatched", statusKey: "Shipped", icon: Truck },
    { label: "Delivered", statusKey: "Delivered", icon: CheckCircle2 },
  ];

  if (orderData && orderData.status === "Cancelled") {
    const fromStatus = orderData.cancelledFromStatus || "Pending";
    if (fromStatus === "Pending") {
      steps = [
        { label: "Order Placed", statusKey: "Pending", icon: ClipboardList },
        { label: "Cancelled", statusKey: "Cancelled", icon: XCircle },
      ];
    } else if (fromStatus === "Processing") {
      steps = [
        { label: "Order Placed", statusKey: "Pending", icon: ClipboardList },
        { label: "Processing", statusKey: "Processing", icon: Clock },
        { label: "Cancelled", statusKey: "Cancelled", icon: XCircle },
      ];
    } else if (fromStatus === "Shipped") {
      steps = [
        { label: "Order Placed", statusKey: "Pending", icon: ClipboardList },
        { label: "Processing", statusKey: "Processing", icon: Clock },
        { label: "Dispatched", statusKey: "Shipped", icon: Truck },
        { label: "Cancelled", statusKey: "Cancelled", icon: XCircle },
      ];
    }
  }

  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Track Your Order</h1>
          <p className="text-sm sm:text-base text-slate-300">
            Check the real-time delivery status of your ShopEase purchase.
          </p>
        </div>

        {/* Search Bar Card */}
        <div className="bg-slate-700 p-6 rounded-2xl border border-slate-600 shadow-lg mb-6">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your Order ID (e.g., e744ff66 or full ID)"
                className="form-input py-2 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2 text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Track
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Container */}
        {hasSearched && !loading && (
          <div className="space-y-6 animate-fade-in-up">
            {orderData ? (
              <div className="bg-slate-700 p-6 rounded-2xl border border-slate-600 shadow-lg">
                {/* Order Meta */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-slate-600 gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm sm:text-base md:text-lg font-bold text-white flex flex-wrap items-center gap-x-1.5">
                      <span>Order</span>
                      <span className="text-xs sm:text-sm md:text-base font-mono text-slate-300 break-all">#{orderData._id}</span>
                    </h2>
                    <p className="text-slate-300 text-xs sm:text-sm mt-1">
                      Placed on: {new Date(orderData.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-1.5 text-xs sm:text-sm sm:flex-col sm:items-end shrink-0">
                    <span className="text-slate-400">Payment Status:</span>
                    <span className={`font-semibold ${orderData.isPaid ? 'text-emerald-400' : 'text-yellow-400'}`}>
                      {orderData.isPaid ? 'Paid' : 'Pending Payment'}
                    </span>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="py-6">
                  <div className="relative">
                    {/* Progress Bar Line Segments running from center-to-center */}
                    {steps.slice(0, -1).map((step, idx) => {
                      const currentStepState = getStepStatus(orderData.status, step.statusKey);
                      const nextStepState = getStepStatus(orderData.status, steps[idx + 1].statusKey);
                      
                      let lineBg = "bg-slate-600";
                      if (orderData.status === "Cancelled" && (nextStepState === "cancelled" || currentStepState === "cancelled")) {
                        lineBg = "bg-red-500";
                      } else if (currentStepState === "completed") {
                        if (orderData.status === "Delivered") {
                          lineBg = "bg-emerald-500";
                        } else {
                          lineBg = "bg-yellow-400";
                        }
                      }

                      return (
                        <div
                          key={idx}
                          className={`absolute h-1 -translate-y-1/2 hidden md:block ${lineBg}`}
                          style={{
                            left: `${((2 * idx + 1) / (2 * steps.length)) * 100}%`,
                            width: `${(1 / steps.length) * 100}%`,
                            top: "20px",
                          }}
                        ></div>
                      );
                    })}
                    <div className="flex flex-col md:grid gap-8 relative z-10" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
                      {steps.map((step, idx) => {
                        const state = getStepStatus(orderData.status, step.statusKey);
                        const StepIcon = step.icon;
                        
                        let circleClass = "";
                        let textClass = "";

                        if (orderData.status === "Delivered" && step.statusKey === "Delivered") {
                          circleClass = "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20";
                          textClass = "text-emerald-400 font-bold";
                        } else if (state === "completed") {
                          circleClass = "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20";
                          textClass = "text-emerald-400 font-semibold";
                        } else if (state === "active") {
                          circleClass = "bg-yellow-400 border-yellow-400 text-slate-900 animate-pulse shadow-yellow-400/20";
                          textClass = "text-yellow-400 font-bold";
                        } else if (state === "cancelled") {
                          circleClass = "bg-red-500 border-red-500 text-white shadow-red-500/20";
                          textClass = "text-red-400 font-bold";
                        } else {
                          circleClass = "bg-slate-800 border-slate-600 text-slate-400";
                          textClass = "text-slate-400";
                        }

                        // Determine line segment color for mobile vertical segments
                        let lineBg = "bg-slate-600";
                        if (idx < steps.length - 1) {
                          const nextStepState = getStepStatus(orderData.status, steps[idx + 1].statusKey);
                          if (orderData.status === "Cancelled" && (nextStepState === "cancelled" || state === "cancelled")) {
                            lineBg = "bg-red-500";
                          } else if (state === "completed") {
                            if (orderData.status === "Delivered") {
                              lineBg = "bg-emerald-500";
                            } else {
                              lineBg = "bg-yellow-400";
                            }
                          }
                        }

                        return (
                          <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-3 text-left md:text-center relative">
                            <div className="flex justify-center w-10 md:w-full md:h-10 items-center relative">
                              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 shadow-lg z-10 ${circleClass}`}>
                                <StepIcon className="h-4.5 w-4.5" />
                              </div>
                              {/* Vertical Line Segment for mobile (drawn below the circle to connect to the next step) */}
                              {idx < steps.length - 1 && (
                                <div className={`absolute top-10 bottom-0 left-5 w-0.5 -translate-x-1/2 -mb-8 md:hidden ${lineBg}`}></div>
                              )}
                            </div>
                            <div className="mt-0 md:mt-0 flex-1 md:flex-initial pt-1 md:pt-0">
                              <h4 className={`text-xs sm:text-sm ${textClass}`}>{step.label}</h4>
                              <p className="text-[10px] text-slate-300 mt-0.5">
                                {orderData.status === step.statusKey &&
                                 orderData.status !== "Delivered" &&
                                 orderData.status !== "Cancelled"
                                 ? 'Active Step' : ''}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Shipping Details summary */}
                <div className="mt-6 p-4 bg-slate-800/40 rounded-xl border border-slate-600 flex items-start gap-3">
                  <Package className="h-5 w-5 text-yellow-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">Fulfillment & Final-Sale Reminder</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Our system shows your package is currently listed as <span className="text-yellow-400 font-bold">{orderData.status}</span>. In accordance with our customer service terms, orders cannot be returned or cancelled once verified.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-700 p-6 rounded-2xl border border-slate-600 text-center py-8">
                <p className="text-red-400 font-semibold text-base">Order Not Found</p>
                <p className="text-slate-300 text-xs sm:text-sm mt-2">
                  We couldn't retrieve any records for the Order ID entered. Please verify the ID from your email receipt or contact support.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
