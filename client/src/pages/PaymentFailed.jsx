"use client";

import { Link, useNavigate } from "react-router-dom";
import { XCircle, ShoppingBag, ArrowLeft } from "lucide-react";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 py-16 px-4">
      <div className="max-w-md w-full bg-slate-700 rounded-2xl shadow-xl border border-slate-600 p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20">
            <XCircle className="h-12 w-12 text-red-500 animate-pulse" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Payment Failed</h2>
        <p className="text-slate-300 text-sm leading-relaxed mb-6">
          Sorry, the payment was not completed so your order could not be placed. Please retry payment.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate("/checkout?step=3")}
            className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-4 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
            Retry Payment
          </button>
          <Link
            to="/cart"
            className="w-full sm:w-auto bg-slate-600 hover:bg-slate-500 text-white font-semibold px-4 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            Go to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
