"use client";

import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";

const Wishlist = () => {
  const { items, removeFromWishlist, loading } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleAddToCart = async (product) => {
    const success = await addToCart(product);
    if (success) {
      await removeFromWishlist(product._id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="mx-auto h-24 w-24 text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Login Required
            </h2>
            <p className="text-slate-300 mb-8">
              Please login to view your wishlist.
            </p>
            <Link
              to="/login"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="mx-auto h-24 w-24 text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-slate-300 mb-8">
              Save items you love to your wishlist and shop them later.
            </p>
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
          <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
          <span className="text-slate-300">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div
              key={product._id}
              className="bg-slate-700 border border-slate-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group h-full flex flex-col overflow-hidden"
            >
              {/* Product Image */}
              <Link to={`/products/${product._id}`} className="block relative">
                <div className="aspect-square bg-slate-600 overflow-hidden rounded-t-2xl">
                  <img
                    src={
                      product.images?.[0]?.url ||
                      `/placeholder.svg?height=400&width=400&query=${
                        product.name || "product"
                      }`
                    }
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Remove from Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromWishlist(product._id);
                  }}
                  className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* Stock Status */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-2xl">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                      Out of Stock
                    </span>
                  </div>
                )}
              </Link>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Category and Brand */}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-emerald-500 bg-opacity-20 text-emerald-400 px-3 py-1 rounded-lg text-xs font-semibold">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="text-xs text-slate-400 font-medium bg-slate-600 px-2 py-1 rounded-lg">
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <Link to={`/products/${product._id}`}>
                  <h3 className="text-lg font-bold text-slate-100 hover:text-yellow-400 transition-colors line-clamp-2 mb-3 leading-tight min-h-[3.5rem]">
                    {product.name}
                  </h3>
                </Link>

                {/* Price and Actions */}
                <div className="flex-1 flex flex-col justify-end">
                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-yellow-400">
                        ₹{product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-slate-500 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    {product.stock > 0 && product.stock <= 10 && (
                      <span className="text-xs text-orange-400 font-semibold bg-orange-900 bg-opacity-30 px-2 py-1 rounded-full border border-orange-500">
                        Only {product.stock} left
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {isInCart(product._id) ? (
                      <button
                        onClick={() => navigate(`/cart#cart-item-${product._id}`)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Go to Cart
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-slate-600 disabled:text-slate-400 text-slate-900 font-semibold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {product.stock === 0 ? "Out of Stock" : "Move to Cart"}
                      </button>
                    )}

                    <Link
                      to={`/products/${product._id}`}
                      className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
