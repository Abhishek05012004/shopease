"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { CreditCard, Truck, Shield } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ordersAPI } from "../services/api";
import api from "../services/api"; // will use this for pay endpoint directly if needed
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    // Shipping Address
    fullName: user?.name || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    postalCode: user?.address?.zipCode || "",
    country: user?.address?.country || "India",
    phone: user?.phone || "",
    // Payment
    paymentMethod: "Demo",
    demoResult: "success", // "success" | "fail" for demo payments
  });

  const [cashfreeOrder, setCashfreeOrder] = useState(null); // optional Cashfree test info

  const subtotal = getCartTotal();
  const tax = 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const createOrderMutation = useMutation(ordersAPI.createOrder, {
    onSuccess: async (data) => {
      const created = data.data;
      try {
        if (formData.paymentMethod === "Demo") {
          if (formData.demoResult === "success") {
            await ordersAPI.payOrder(created._id, {
              id: `demo_${Date.now()}`,
              status: "COMPLETED",
              update_time: new Date().toISOString(),
              email_address: formData.email,
            });
            toast.success("Order placed and paid (Demo)! Confirmation email sent to your email.");
          } else {
            toast.error("Demo payment failed.");
          }
        } else if (formData.paymentMethod === "Cashfree") {
          const resp = await api.post("/payments/cashfree/order", {
            amount: Number(total.toFixed(2)),
            currency: "INR",
            customerEmail: formData.email,
            customerPhone: formData.phone,
            orderId: created._id,
          });

          if (resp.data?.payment_session_id) {
            const cashfree = window.Cashfree({ mode: "sandbox" });
            cashfree.checkout({
              paymentSessionId: resp.data.payment_session_id,
              redirectTarget: "_self",
            });
          } else {
            throw new Error("Could not retrieve Cashfree payment session ID");
          }
        } else {
          toast.success("Order placed with Cash on Delivery! Confirmation email sent to your email.");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || err.message || "Payment update failed");
        if (formData.paymentMethod === "Cashfree") {
          navigate("/payment-failed");
        }
      } finally {
        if (formData.paymentMethod !== "Cashfree") {
          clearCart();
          navigate(`/orders/${created._id}`);
        }
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to place order");
    },
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInitiateCashfree = async () => {
    try {
      const resp = await api.post("/payments/cashfree/order", {
        amount: Number(total.toFixed(2)),
        currency: "INR",
        customerEmail: formData.email,
        customerPhone: formData.phone,
      });
      setCashfreeOrder(resp.data);
      toast.success("Cashfree test order created.");
    } catch (e) {
      toast.error(
        e.response?.data?.message || "Failed to create Cashfree test order"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!formData.email) {
      toast.error("Email is required");
      setStep(1);
      return;
    }

    const orderData = {
      orderItems: items.map((item) => {
        const productObj =
          typeof item.product === "object" ? item.product : null;
        const imageSrc =
          productObj?.images?.[0]?.url ||
          item.images?.[0]?.url ||
          productObj?.image ||
          item.image ||
          "/placeholder.svg";

        return {
          product: productObj?._id || item.product || item._id,
          name: item.name || productObj?.name || "Product",
          image: imageSrc,
          price:
            typeof item.price === "number"
              ? item.price
              : productObj?.price ?? 0,
          quantity: item.quantity,
        };
      }),
      shippingAddress: {
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
      },
      contactEmail: formData.email,
      paymentMethod: formData.paymentMethod,
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shipping,
      totalPrice: total,
    };

    if (formData.paymentMethod === "Demo" && formData.demoResult === "fail") {
      toast.error("Demo payment failed.");
      navigate("/payment-failed");
      return;
    }

    createOrderMutation.mutate(orderData);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-300 mb-8">
              Add some items to your cart before checking out.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-800 font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { number: 1, title: "Shipping", icon: Truck },
              { number: 2, title: "Review", icon: Shield },
              { number: 3, title: "Payment", icon: CreditCard },
            ].map((stepItem) => (
              <div key={stepItem.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step >= stepItem.number
                      ? "bg-yellow-500 border-yellow-500 text-slate-800"
                      : "border-gray-500 text-gray-400"
                  }`}
                >
                  <stepItem.icon className="h-5 w-5" />
                </div>
                <span
                  className={`ml-2 font-medium ${
                    step >= stepItem.number
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                >
                  {stepItem.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <div className="bg-slate-700 rounded-lg shadow-sm border border-slate-600 p-6">
                  <h2 className="text-xl font-semibold mb-6 text-white">
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          !formData.email ||
                          !formData.fullName ||
                          !formData.address ||
                          !formData.city ||
                          !formData.postalCode ||
                          !formData.phone
                        ) {
                          toast.error("Please fill in all required fields.");
                          return;
                        }
                        setStep(2);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-slate-800 font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                      Continue to Review
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Order Review */}
              {step === 2 && (
                <div className="bg-slate-700 rounded-lg shadow-sm border border-slate-600 p-6">
                  <h2 className="text-xl font-semibold mb-6 text-white">
                    Review Your Order
                  </h2>

                  {/* Shipping Summary */}
                  <div className="mb-8 border-b border-slate-600 pb-6">
                    <h3 className="text-lg font-medium text-yellow-500 mb-3">
                      Shipping Information
                    </h3>
                    <div className="text-slate-300 space-y-1">
                      <p>
                        <span className="font-semibold text-white">Name:</span>{" "}
                        {formData.fullName}
                      </p>
                      <p>
                        <span className="font-semibold text-white">Email:</span>{" "}
                        {formData.email}
                      </p>
                      <p>
                        <span className="font-semibold text-white">Address:</span>{" "}
                        {formData.address}, {formData.city}, {formData.postalCode},{" "}
                        {formData.country}
                      </p>
                      <p>
                        <span className="font-semibold text-white">Phone:</span>{" "}
                        {formData.phone}
                      </p>
                    </div>
                  </div>

                  {/* Products ordered summary */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-medium text-yellow-500">
                      Products Ordered
                    </h3>
                    {items.map((item) => {
                      const productObj =
                        typeof item.product === "object" ? item.product : null;
                      const name = item.name || productObj?.name || "Product";
                      const price =
                        typeof item.price === "number"
                          ? item.price
                          : productObj?.price ?? 0;
                      const imageSrc =
                        productObj?.images?.[0]?.url ||
                        item.images?.[0]?.url ||
                        productObj?.image ||
                        item.image ||
                        `/placeholder.svg?height=60&width=60&query=${encodeURIComponent(
                          name
                        )}`;

                      return (
                        <div key={item._id} className="flex items-center gap-4">
                          {/* Col 1: Thumbnail (fixed width) */}
                          <div className="w-16 shrink-0">
                            <img
                              src={imageSrc || "/placeholder.svg"}
                              alt={name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          </div>

                          {/* Col 2: Info (flex-grow) */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">
                              {name}
                            </h4>
                            <p className="text-gray-300">
                              Qty: {item.quantity}
                            </p>
                          </div>

                          {/* Col 3: Line total (fixed, right-aligned) */}
                          <div className="w-28 text-right">
                            <p className="font-semibold text-yellow-500">
                              ₹{(price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-slate-600 hover:bg-slate-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                      Back to Shipping
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-slate-800 font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <div className="bg-slate-700 rounded-lg shadow-sm border border-slate-600 p-6">
                  <h2 className="text-xl font-semibold mb-6 text-white">
                    Payment Method
                  </h2>

                  <div className="space-y-4 mb-6">
                    {["Demo", "Cashfree", "Cash on Delivery"].map((method) => (
                      <label key={method} className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={handleInputChange}
                          className="text-yellow-500 focus:ring-yellow-500 bg-slate-600 border-slate-500"
                        />
                        <span className="ml-2 font-medium text-white">
                          {method}
                        </span>
                      </label>
                    ))}
                  </div>

                  {formData.paymentMethod === "Demo" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Demo Result <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="demoResult"
                          value={formData.demoResult}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-lg text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        >
                          <option value="success">Success</option>
                          <option value="fail">Fail</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Payment Summary section */}
                  <div className="mt-8 pt-6 border-t border-slate-600 mb-6">
                    <h3 className="text-lg font-medium text-yellow-500 mb-4">
                      Payment Summary
                    </h3>
                    <div className="bg-slate-800/50 p-4 rounded-lg space-y-2 text-sm text-slate-300">
                      {items.map((item) => {
                        const productObj =
                          typeof item.product === "object" ? item.product : null;
                        const name = item.name || productObj?.name || "Product";
                        const price =
                          typeof item.price === "number"
                            ? item.price
                            : productObj?.price ?? 0;
                        return (
                          <div key={item._id} className="flex justify-between">
                            <span>{name} x {item.quantity}</span>
                            <span>₹{(price * item.quantity).toFixed(2)}</span>
                          </div>
                        );
                      })}
                      <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between font-semibold text-white">
                        <span>Total to Pay</span>
                        <span className="text-yellow-500">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-slate-600 hover:bg-slate-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                      Back to Review
                    </button>
                    <button
                      type="submit"
                      disabled={createOrderMutation.isLoading}
                      className="bg-yellow-500 hover:bg-yellow-600 text-slate-800 font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {createOrderMutation.isLoading
                        ? "Processing..."
                        : "Pay & Place Order"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-700 rounded-lg shadow-sm border border-slate-600 p-6 sticky top-[140px] h-fit">
              <h2 className="text-xl font-semibold mb-6 text-white">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="font-medium text-white">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Shipping</span>
                  <span className="font-medium text-white">
                    {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-slate-600 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-yellow-500">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span>Free shipping on orders over ₹500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
