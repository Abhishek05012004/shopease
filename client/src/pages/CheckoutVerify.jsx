"use client";

import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import toast from "react-hot-toast";

const CheckoutVerify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const verificationStarted = useRef(false);

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (!orderId) {
      toast.error("Invalid payment routing parameters.");
      navigate("/payment-failed");
      return;
    }

    // Use ref to prevent double API call in StrictMode
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const verifyPayment = async () => {
      try {
        const resp = await api.get(`/payments/cashfree/verify/${orderId}`);
        if (resp.data?.status === "PAID") {
          clearCart();
          toast.success("Payment successful! Confirmation email sent to your email.");
          navigate(`/orders/${orderId}`);
        } else {
          toast.error("Payment failed or was cancelled.");
          navigate("/payment-failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        toast.error("An error occurred during payment verification.");
        navigate("/payment-failed");
      }
    };

    verifyPayment();
  }, [orderId, navigate, clearCart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-800 py-16 px-4">
      <div className="text-center max-w-md">
        <LoadingSpinner size="large" />
        <h2 className="text-2xl font-bold text-white mt-6 mb-2">Verifying Payment</h2>
        <p className="text-slate-300">Please wait while we confirm your payment status. Do not close or refresh this page.</p>
      </div>
    </div>
  );
};

export default CheckoutVerify;
