import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "react-query";
import { CreditCard, Truck, Shield, User, Mail, MapPin, Phone, Landmark, Wallet, CheckCircle, AlertCircle, Package } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ordersAPI } from "../services/api";
import api from "../services/api"; // will use this for pay endpoint directly if needed
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialStep = queryParams.get("step") ? parseInt(queryParams.get("step")) : 1;
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [step, setStep] = useState(initialStep);

  useEffect(() => {
    navigate(`/checkout?step=${step}`, { replace: true });
  }, [step, navigate]);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    // Shipping Address
    fullName: user?.name || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    postalCode: user?.address?.zipCode || "",
    country: "India",
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
      let paymentSucceeded = true;
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
            paymentSucceeded = false;
            await api.delete(`/orders/${created._id}`);
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
        paymentSucceeded = false;
        toast.error(err.response?.data?.message || err.message || "Payment update failed");
        if (formData.paymentMethod === "Cashfree") {
          try {
            await api.delete(`/orders/${created._id}`);
          } catch (delErr) {
            console.error("Failed to delete order on Cashfree launch exception:", delErr);
          }
          navigate("/payment-failed");
        }
      } finally {
        if (formData.paymentMethod !== "Cashfree" && paymentSucceeded) {
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
        state: formData.state,
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
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-slate-300 mb-8 text-sm">
              Add some items to your cart before checking out.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-800 font-semibold px-4 py-2 text-sm rounded-lg transition-colors"
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
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-6">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-6">
            {[
              { number: 1, title: "Shipping", icon: Truck },
              { number: 2, title: "Review", icon: Shield },
              { number: 3, title: "Payment", icon: CreditCard },
            ].map((stepItem) => (
              <div key={stepItem.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step >= stepItem.number
                      ? "bg-yellow-500 border-yellow-500 text-slate-800 font-bold"
                      : "border-gray-500 text-gray-400"
                  }`}
                >
                  <stepItem.icon className="h-4 w-4" />
                </div>
                <span
                  className={`ml-2 text-xs sm:text-sm font-semibold ${
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
                  <h2 className="text-base sm:text-lg font-semibold mb-4 text-white">
                    Shipping Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="State (e.g. Maharashtra)"
                        className="w-full px-4 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                        Postal Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        placeholder="6-digit postal code"
                        className="w-full px-4 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-2.5 bg-slate-600 border border-slate-500 rounded-lg text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        const emailTrimmed = (formData.email || "").trim();
                        const fullNameTrimmed = (formData.fullName || "").trim();
                        const addressTrimmed = (formData.address || "").trim();
                        const cityTrimmed = (formData.city || "").trim();
                        const stateTrimmed = (formData.state || "").trim();
                        const postalCodeTrimmed = (formData.postalCode || "").trim();
                        const phoneTrimmed = (formData.phone || "").trim();

                        if (
                          !emailTrimmed ||
                          !fullNameTrimmed ||
                          !addressTrimmed ||
                          !cityTrimmed ||
                          !stateTrimmed ||
                          !postalCodeTrimmed ||
                          !phoneTrimmed
                        ) {
                          toast.error("Please fill in all required fields.");
                          return;
                        }

                        // Email format validation
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(emailTrimmed)) {
                          toast.error("Please enter a valid email address.");
                          return;
                        }

                        // Phone number validation: exactly 10 digits
                        const phoneRegex = /^\d{10}$/;
                        if (!phoneRegex.test(phoneTrimmed)) {
                          toast.error("Phone number must be exactly 10 digits.");
                          return;
                        }

                        // Postal code validation: exactly 6 digits
                        const postalCodeRegex = /^\d{6}$/;
                        if (!postalCodeRegex.test(postalCodeTrimmed)) {
                          toast.error("Postal code must be exactly 6 digits (numbers only).");
                          return;
                        }

                        setStep(2);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-slate-800 font-semibold px-4 py-2 text-sm rounded-lg transition-colors"
                    >
                      Continue to Review
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Order Review */}
              {step === 2 && (
                <div className="bg-slate-700 rounded-xl shadow-md border border-slate-600 p-6 space-y-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-yellow-500" />
                      Review Your Order
                    </h2>
                    <p className="text-gray-300 text-xs mt-1">Please inspect your shipping details and items before proceeding.</p>
                  </div>

                  {/* Shipping Info Card */}
                  <div className="bg-slate-800/60 rounded-lg p-5 border border-slate-600/80 space-y-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-yellow-500 flex items-center gap-2 pb-2 border-b border-slate-700">
                      <MapPin className="h-4.5 w-4.5" />
                      Shipping Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-200">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Recipient Name</span>
                          <span className="font-semibold text-white">{formData.fullName}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Email Address</span>
                          <span className="text-white">{formData.email}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Address</span>
                          <span className="text-white">
                            {formData.address}, {formData.city}, {formData.state}, {formData.postalCode}, {formData.country}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="block text-xs text-gray-400 font-medium uppercase tracking-wider">Phone Number</span>
                          <span className="text-white font-mono">{formData.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Products ordered summary */}
                  <div className="space-y-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-yellow-500 flex items-center gap-2">
                      <Package className="h-4.5 w-4.5" />
                      Products Ordered ({items.length})
                    </h3>
                    <div className="bg-slate-800/30 rounded-lg border border-slate-600/60 divide-y divide-slate-600/40">
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
                          <div key={item._id} className="flex items-center gap-4 p-4 hover:bg-slate-800/50 transition-colors">
                            {/* Thumbnail */}
                            <div className="w-14 h-14 shrink-0 bg-slate-700 rounded overflow-hidden border border-slate-600">
                              <img
                                src={imageSrc || "/placeholder.svg"}
                                alt={name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-white text-sm sm:text-base break-normal leading-tight">
                                {name}
                              </h4>
                              <p className="text-gray-300 text-xs sm:text-sm mt-0.5">
                                Qty: <span className="font-semibold text-yellow-500">{item.quantity}</span> @ ₹{price.toFixed(2)} each
                              </p>
                            </div>

                            {/* Line total */}
                            <div className="text-right">
                              <p className="font-semibold text-yellow-500 text-sm sm:text-base">
                                ₹{(price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4 border-t border-slate-600">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-slate-600 hover:bg-slate-500 text-white font-semibold px-4 py-2 text-sm rounded-lg transition-colors"
                    >
                      Back to Shipping
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-slate-800 font-semibold px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {step === 3 && (
                <div className="bg-slate-700 rounded-xl shadow-md border border-slate-600 p-6 space-y-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-yellow-500" />
                      Select Payment Method
                    </h2>
                    <p className="text-gray-300 text-xs mt-1">Select one of our secure local checkout interfaces.</p>
                  </div>

                  {/* Payment Select Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "Demo", title: "Demo Payment", desc: "Simulate checkout success or failure", icon: CreditCard },
                      { id: "Cashfree", title: "Cashfree", desc: "Pay securely via cards/UPI/Netbanking", icon: Landmark },
                      { id: "Cash on Delivery", title: "Cash on Delivery", desc: "Pay cash upon arrival of product", icon: Wallet },
                    ].map((method) => {
                      const IconComponent = method.icon;
                      const isSelected = formData.paymentMethod === method.id;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                          className={`relative cursor-pointer rounded-xl p-4 border-2 transition-all flex flex-col justify-between space-y-3 ${
                            isSelected
                              ? "bg-slate-800 border-yellow-500 ring-1 ring-yellow-500"
                              : "bg-slate-800/40 border-slate-600 hover:border-slate-500 hover:bg-slate-800/60"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <IconComponent className={`h-6 w-6 ${isSelected ? "text-yellow-500" : "text-gray-400"}`} />
                            <div className={`h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? "border-yellow-500 bg-yellow-500" : "border-slate-500"
                            }`}>
                              {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-slate-800" />}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white text-sm">{method.title}</h4>
                            <p className="text-[10px] text-gray-400 mt-1 leading-tight">{method.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Demo Options Config inside card */}
                  {formData.paymentMethod === "Demo" && (
                    <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-600 space-y-2.5">
                      <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        Configure Demo Outcome
                      </label>
                      <select
                        name="demoResult"
                        value={formData.demoResult}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent font-medium"
                      >
                        <option value="success">Success Scenario</option>
                        <option value="fail">Fail Scenario</option>
                      </select>
                    </div>
                  )}

                  {/* Summary Section */}
                  <div className="bg-slate-800/30 p-5 rounded-lg border border-slate-600/60 space-y-4">
                    <h3 className="text-xs sm:text-sm font-semibold text-yellow-500 pb-2 border-b border-slate-700">
                      Payment Summary
                    </h3>
                    <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                      {items.map((item) => {
                        const productObj =
                          typeof item.product === "object" ? item.product : null;
                        const name = item.name || productObj?.name || "Product";
                        const price =
                          typeof item.price === "number"
                            ? item.price
                            : productObj?.price ?? 0;
                        return (
                          <div key={item._id} className="flex justify-between items-center gap-4">
                            <span className="truncate flex-1">{name} <span className="text-gray-400 font-mono">x {item.quantity}</span></span>
                            <span className="font-medium text-white shrink-0">₹{(price * item.quantity).toFixed(2)}</span>
                          </div>
                        );
                      })}
                      <div className="border-t border-slate-700 pt-3 mt-3 flex justify-between items-center text-base sm:text-lg font-bold text-white">
                        <span>Total to Pay</span>
                        <span className="text-yellow-500">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4 border-t border-slate-600">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-slate-600 hover:bg-slate-500 text-white font-semibold px-4 py-2 text-sm rounded-lg transition-colors"
                    >
                      Back to Review
                    </button>
                    <button
                      type="submit"
                      disabled={createOrderMutation.isLoading}
                      className="bg-yellow-500 hover:bg-yellow-600 text-slate-800 font-semibold px-4 py-2 text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {createOrderMutation.isLoading ? "Processing..." : "Pay & Place Order"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-700 rounded-lg shadow-sm border border-slate-600 p-6 sticky top-[140px] h-fit">
              <h2 className="text-base sm:text-lg font-semibold mb-4 text-white">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 text-sm">
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
                <div className="border-t border-slate-600 pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-yellow-500">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-gray-300">
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
