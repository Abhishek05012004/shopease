import { Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart, Eye, Truck, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const ProductCard = ({ product, viewMode = "grid" }) => {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const fillPercentage = Math.max(0, Math.min(100, (rating - i) * 100));

      return (
        <div key={i} className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${fillPercentage}%` }}
          >
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
          </div>
        </div>
      );
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleViewProduct = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (viewMode === "list") {
    return (
      <div className="bg-slate-700 border border-slate-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
        <div className="flex gap-6 p-6">
          {/* Product Image */}
          <Link
            to={`/products/${product._id}`}
            className="flex-shrink-0 group"
            onClick={handleViewProduct}
          >
            <div className="relative w-32 h-32 bg-slate-600 rounded-xl overflow-hidden">
              <img
                src={
                  product.images?.[0]?.url ||
                  `/placeholder.svg?height=200&width=200&query=${
                    product.name || "product"
                  }`
                }
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </Link>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Link
                  to={`/products/${product._id}`}
                  onClick={handleViewProduct}
                >
                  <h3
                    className="text-xl font-bold text-slate-100 hover:text-yellow-400 transition-colors line-clamp-2 mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center space-x-4 mb-3">
                  <span className="bg-emerald-500 bg-opacity-20 text-emerald-400 px-2 py-1 rounded-lg text-xs font-semibold">
                    {product.category}
                  </span>
                  {product.brand && (
                    <span className="text-sm text-slate-300 font-medium">
                      {product.brand}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-lg transition-all duration-200 border ${
                  isInWishlist(product._id)
                    ? "text-red-400 bg-red-500 bg-opacity-20 border-red-400 hover:bg-red-500 hover:bg-opacity-30"
                    : "text-slate-300 hover:text-red-400 hover:bg-red-500 hover:bg-opacity-20 border-slate-600 hover:border-red-400"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist(product._id) ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>

            <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            {/* Rating and Reviews */}
            <div className="flex items-center mb-4">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm font-medium text-slate-300 ml-2">
                {product.rating.toFixed(1)} ({product.numReviews} reviews)
              </span>
            </div>

            {/* Features */}
            <div className="flex items-center space-x-4 mb-4 text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <Truck className="h-3 w-3" />
                <span>{product.price >= 500 ? "Free Shipping" : "+₹50 Shipping Fee"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-3 w-3" />
                <span>Warranty</span>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span
                  className="text-2xl font-bold text-yellow-400"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-slate-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  to={`/products/${product._id}`}
                  onClick={handleViewProduct}
                  className="border border-slate-500 text-slate-300 hover:text-yellow-400 hover:border-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10 px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
                {isInCart(product._id) ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/cart#cart-item-${product._id}`);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 text-sm rounded-lg transition-colors flex items-center"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Go to Cart
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="btn-primary px-6 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-700 border border-slate-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group h-full flex flex-col overflow-hidden">
      {/* Product Image */}
      <Link
        to={`/products/${product._id}`}
        className="block relative"
        onClick={handleViewProduct}
      >
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

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleWishlistToggle}
            className={`bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2 ${
              isInWishlist(product._id)
                ? "text-red-500 border-red-500"
                : "text-slate-800 border-white"
            }`}
          >
            <Heart
              className={`h-5 w-5 ${
                isInWishlist(product._id) ? "fill-current" : ""
              }`}
            />
          </button>
          <Link
            to={`/products/${product._id}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleViewProduct();
              window.location.href = `/products/${product._id}`;
            }}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-slate-800 p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 border-2 border-white"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>

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
        <Link to={`/products/${product._id}`} onClick={handleViewProduct}>
          <h3
            className="text-lg font-bold text-slate-100 hover:text-yellow-400 transition-colors line-clamp-2 mb-3 leading-tight min-h-[3.5rem]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm font-medium text-slate-300 ml-2">
            {product.rating.toFixed(1)} ({product.numReviews})
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center justify-center space-x-6 mb-4 py-3 bg-gradient-to-r from-slate-600 to-slate-600 rounded-lg border border-slate-500">
          <div className="flex items-center space-x-1 text-xs text-slate-200">
            <Truck className={`h-4 w-4 ${product.price >= 500 ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="font-medium">{product.price >= 500 ? "Free Ship" : "+₹50 Ship"}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-slate-200">
            <Shield className="h-4 w-4 text-yellow-400" />
            <span className="font-medium">Warranty</span>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex-1 flex flex-col justify-end">
          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span
                className="text-2xl font-bold text-yellow-400"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-slate-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {product.stock > 0 && product.stock < 10 && (
              <span className="text-xs text-orange-400 font-semibold bg-orange-900 bg-opacity-30 px-2 py-1 rounded-full border border-orange-500">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          {isInCart(product._id) ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/cart#cart-item-${product._id}`);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-semibold rounded-lg flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Go to Cart
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-semibold"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
