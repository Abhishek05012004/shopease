import { Link, useLocation } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const { isAuthenticated } = useAuth();

  const location = useLocation();

  useEffect(() => {
    // If there is a hash (e.g., #cart-item-123), scroll to it and highlight it
    const hash = window.location.hash;
    if (hash) {
      const scrollTimer = setTimeout(() => {
        const elementId = hash.substring(1);
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });

          // Highlight the item briefly with a background color
          element.classList.add("bg-slate-600", "bg-opacity-50");
          const highlightTimer = setTimeout(() => {
            element.classList.remove("bg-slate-600", "bg-opacity-50");
          }, 1500);
          return () => clearTimeout(highlightTimer);
        }
      }, 150);
      return () => clearTimeout(scrollTimer);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [items, location.hash]);

  const subtotal = getCartTotal();
  const tax = 0;
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500, else ₹50
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-slate-300 mb-4">
              Looks like you haven't added any items to your cart yet.
            </p>
            {!isAuthenticated && (
              <div className="bg-slate-700 border border-slate-600 rounded-lg p-6 mb-6 max-w-md mx-auto">
                <p className="text-yellow-400 font-medium mb-4">
                  Please login to add products to your cart and track your
                  orders
                </p>
                <div className="space-y-2">
                  <Link
                    to="/login?redirect=/cart"
                    className="block w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register?redirect=/cart"
                    className="block w-full bg-slate-600 hover:bg-slate-500 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            )}
            <Link
              to="/products"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Shopping Cart</h1>
          {!isAuthenticated && (
            <div className="bg-slate-700 border border-yellow-500 rounded-lg px-3 py-1.5">
              <p className="text-yellow-400 text-xs sm:text-sm font-medium">
                <Link
                  to="/login?redirect=/cart"
                  className="hover:text-yellow-300"
                >
                  Login
                </Link>{" "}
                to save your cart and checkout
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-slate-700 rounded-lg shadow-sm border border-slate-600">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base sm:text-lg font-semibold text-white">
                    Cart Items ({items.length})
                  </h2>
                  <button
                    onClick={clearCart}
                    className="text-red-400 hover:text-red-300 text-xs sm:text-sm font-medium transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="space-y-6">
                  {items.map((item) => {
                    const productObj =
                      typeof item.product === "object" ? item.product : null;

                    // Prefer product object's id, then referenced id, then cart item id
                    const productId =
                      productObj?._id || item.product || item._id;

                    // Prefer names/categories/prices from product object if cart snapshot is incomplete
                    const name = item.name || productObj?.name || "Product";
                    const category =
                      item.category || productObj?.category || "";
                    const price =
                      typeof item.price === "number"
                        ? item.price
                        : productObj?.price ?? 0;

                    // Try multiple image fields in order, then placeholder
                    const imageSrc =
                      productObj?.images?.[0]?.url ||
                      item.images?.[0]?.url ||
                      productObj?.image ||
                      item.image ||
                      `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(
                        name || "product"
                      )}`;

                    return (
                      <div
                        key={item._id}
                        id={`cart-item-${productId}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-600 last:border-b-0 transition-all duration-500 rounded-xl px-2"
                      >
                        {/* Left Group: Image & Product Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0 w-full">
                          <Link
                            to={`/products/${productId}`}
                            className="w-16 sm:w-20 shrink-0"
                          >
                            <img
                              src={imageSrc || "/placeholder.svg"}
                              alt={name}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link to={`/products/${productId}`}>
                              <h3 className="text-sm sm:text-base font-medium text-white hover:text-yellow-400 transition-colors break-normal leading-tight">
                                {name}
                              </h3>
                            </Link>
                            <p className="text-slate-300 text-xs sm:text-sm mt-1 truncate">
                              {category}
                            </p>
                            <p className="text-yellow-400 font-semibold mt-1.5 text-sm sm:text-base">
                              ₹{price}
                            </p>
                          </div>
                        </div>

                        {/* Right Group: Controls, Price & Delete */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto shrink-0 border-t border-slate-600/30 pt-4 sm:border-t-0 sm:pt-0">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-slate-500 rounded-lg bg-slate-600">
                            <button
                              onClick={() =>
                                item.quantity > 1 &&
                                updateQuantity(productId, item.quantity - 1)
                              }
                              disabled={item.quantity === 1}
                              aria-disabled={item.quantity === 1}
                              className={`p-1.5 transition-colors ${
                                item.quantity === 1
                                  ? "text-slate-500 cursor-not-allowed"
                                  : "text-slate-300 hover:text-white hover:bg-slate-500"
                              }`}
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 py-1 font-medium text-white text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(productId, item.quantity + 1)
                              }
                              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-500 transition-colors"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Line total & Delete actions */}
                          <div className="flex items-center gap-4">
                            <div className="text-right min-w-[70px]">
                              <p className="text-sm sm:text-base font-semibold text-white">
                                ₹{(price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromCart(productId)}
                              className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                              aria-label="Remove item"
                              title="Remove item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-700 rounded-lg shadow-sm border border-slate-600 p-6 sticky top-[140px] h-fit">
              <h2 className="text-base sm:text-lg font-semibold text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Subtotal</span>
                  <span className="font-medium text-white">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Shipping</span>
                  <span className="font-medium text-white">
                    {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-slate-400">
                    Add ₹{(500 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
                <div className="border-t border-slate-600 pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span className="text-white">Total</span>
                    <span className="text-white">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {isAuthenticated ? (
                  <Link
                    to="/checkout"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-2 px-3 rounded-lg text-sm transition-colors text-center block"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login?redirect=/checkout"
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold py-2 px-3 rounded-lg text-sm transition-colors text-center block"
                    >
                      Login to Checkout
                    </Link>
                    <p className="text-xs text-slate-300 text-center">
                      New customer?{" "}
                      <Link
                        to="/register?redirect=/checkout"
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                )}
                <Link
                  to="/products"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-slate-600">
                <div className="flex items-center space-x-2 text-sm text-slate-300">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Secure checkout guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
