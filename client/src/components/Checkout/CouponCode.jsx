"use client";

import { useState } from "react";

const CouponCode = ({ onCouponApply, orderAmount }) => {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/coupons/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: couponCode,
            orderAmount,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setAppliedCoupon(data);
        onCouponApply(data);
        setError("");
      } else {
        setError(data.message);
        setAppliedCoupon(null);
        onCouponApply(null);
      }
    } catch (error) {
      setError("Failed to validate coupon code");
      setAppliedCoupon(null);
      onCouponApply(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setError("");
    onCouponApply(null);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Coupon Code</h3>

      {!appliedCoupon ? (
        <form onSubmit={handleApplyCoupon} className="space-y-3">
          <div>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !couponCode.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Validating..." : "Apply Coupon"}
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
            <div>
              <p className="font-medium text-green-800">
                {appliedCoupon.coupon.code}
              </p>
              <p className="text-sm text-green-600">
                {appliedCoupon.coupon.description}
              </p>
              <p className="text-sm font-medium text-green-800">
                Discount: ${appliedCoupon.discountAmount.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponCode;
