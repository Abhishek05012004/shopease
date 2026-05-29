import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import {
  Star,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Lock,
  ShoppingCart,
} from "lucide-react";
import { productsAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import ProductReviews from "../components/Product/ProductReviews";
import RelatedProducts from "../components/Product/RelatedProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const { addToCart, isInCart, isAuthenticated: cartAuthenticated } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const {
    data: product,
    isLoading,
    error,
  } = useQuery(["product", id], () => productsAPI.getProduct(id), {
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (product?.data) {
      if (!isAuthenticated) {
        navigate(`/login?redirect=/products/${product.data._id}`);
        return;
      }

      for (let i = 0; i < quantity; i++) {
        addToCart(product.data);
      }
    }
  };

  const handleWishlistToggle = () => {
    if (product?.data) {
      if (isInWishlist(product.data._id)) {
        removeFromWishlist(product.data._id);
      } else {
        addToWishlist(product.data);
      }
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.data?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product?.data) {
    return (
      <div className="min-h-screen bg-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-400">Product not found.</p>
            <Link
              to="/products"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold px-6 py-3 rounded-lg mt-4 transition-colors"
            >
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const productData = product.data;
  const images =
    productData.images?.length > 0
      ? productData.images
      : [
          {
            url: `/placeholder.svg?height=500&width=500&query=${productData.name}`,
            alt: productData.name,
          },
        ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const fillPercentage = Math.max(0, Math.min(100, (rating - i) * 100));

      return (
        <div key={i} className="relative">
          <Star className="h-4 w-4 text-slate-500" />
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

  return (
    <div className="min-h-screen bg-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-8">
          <Link to="/" className="hover:text-yellow-400 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-yellow-400 transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${productData.category}`}
            className="hover:text-yellow-400 transition-colors"
          >
            {productData.category}
          </Link>
          <span>/</span>
          <span className="text-white">{productData.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-slate-700 rounded-lg mb-4 overflow-hidden border border-slate-600">
              <img
                src={images[selectedImage]?.url || "/placeholder.svg"}
                alt={images[selectedImage]?.alt || productData.name}
                className="w-full h-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? "border-yellow-500"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt || `${productData.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">
              {productData.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4 text-xs sm:text-sm">
              <div className="flex items-center">
                {renderStars(productData.rating)}
              </div>
              <span className="text-slate-300">
                ({productData.numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4 mb-5">
              <span className="text-2xl font-bold text-yellow-400">
                ₹{productData.price}
              </span>
              {productData.originalPrice > productData.price && (
                <span className="text-base text-slate-400 line-through">
                  ₹{productData.originalPrice}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {productData.stock > 0 ? (
                productData.stock < 10 ? (
                  <span className="text-orange-400 font-medium bg-orange-950/30 border border-orange-500/30 px-3 py-1.5 rounded-lg">
                    Only {productData.stock} left in stock - order soon!
                  </span>
                ) : (
                  <span className="text-emerald-400 font-medium bg-emerald-950/30 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                    In Stock
                  </span>
                )
              ) : (
                <span className="text-red-400 font-medium bg-red-950/30 border border-red-500/30 px-3 py-1.5 rounded-lg">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-slate-300 leading-relaxed">
                {productData.description}
              </p>
            </div>

            {/* Quantity Selector */}
            {productData.stock > 0 && (
              <div className="flex items-center space-x-4 mb-6">
                <span className="font-medium text-white">Quantity:</span>
                <div className="flex items-center border border-slate-600 rounded-lg bg-slate-700">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= productData.stock}
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {isAuthenticated && isInCart(productData._id) ? (
                <button
                  onClick={() => navigate(`/cart#cart-item-${productData._id}`)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-4.5 w-4.5 mr-1.5" />
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={productData.stock === 0}
                  className={`flex-1 font-semibold py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center ${
                    productData.stock === 0
                      ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                      : !isAuthenticated
                      ? "bg-slate-600 hover:bg-slate-500 text-white border border-slate-500"
                      : "bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                  }`}
                >
                  {!isAuthenticated ? (
                    <Lock className="h-4.5 w-4.5 mr-1.5" />
                  ) : (
                    <ShoppingCart className="h-4.5 w-4.5 mr-1.5" />
                  )}
                  {!isAuthenticated ? "Login to Add to Cart" : "Add to Cart"}
                </button>
              )}
              <button
                onClick={handleWishlistToggle}
                className={`font-semibold py-2 px-4 rounded-lg text-sm border transition-colors flex items-center justify-center ${
                  isInWishlist(productData._id)
                    ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                    : "bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                }`}
              >
                <Heart
                  className={`h-4.5 w-4.5 mr-1.5 ${
                    isInWishlist(productData._id) ? "fill-current" : ""
                  }`}
                />
                {isInWishlist(productData._id)
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
              </button>
            </div>

            {!isAuthenticated && (
              <div className="mb-8 p-4 bg-slate-700 border border-slate-600 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                  <Lock className="h-5 w-5" />
                  <span className="font-medium">Login Required</span>
                </div>
                <p className="text-slate-300 text-sm">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-yellow-400 hover:text-yellow-300 font-semibold no-underline"
                  >
                    login
                  </Link>{" "}
                  to add items to your cart and make purchases.
                </p>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Truck className="h-5 w-5 text-yellow-400" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Shield className="h-5 w-5 text-yellow-400" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <Shield className="h-5 w-5 text-yellow-400" />
                <span>All Sales Final</span>
              </div>
            </div>

            {/* Product Details - Premium Info Cards */}
            <div className="border-t border-slate-700 pt-6 mt-8">
              <h3 className="font-semibold text-white mb-4 text-base">Product Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 bg-opacity-40 p-4 rounded-xl border border-slate-600 text-center">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Brand</span>
                  <span className="text-white font-semibold text-sm">{productData.brand || "N/A"}</span>
                </div>
                <div className="bg-slate-700 bg-opacity-40 p-4 rounded-xl border border-slate-600 text-center">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Category</span>
                  <span className="text-white font-semibold text-sm">{productData.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-16">
          <div className="border-b border-slate-600">
            <nav className="flex space-x-8 overflow-x-auto whitespace-nowrap pb-1 scrollbar-none">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors shrink-0 ${
                    activeTab === tab
                      ? "border-yellow-500 text-yellow-400"
                      : "border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="bg-slate-700 p-6 rounded-2xl border border-slate-600 shadow-lg">
                <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-yellow-500 rounded-full inline-block"></span>
                  Product Overview
                </h4>
                <p className="text-slate-200 leading-relaxed text-sm whitespace-pre-line">
                  {productData.description}
                </p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="bg-slate-700 rounded-2xl border border-slate-600 shadow-lg overflow-hidden">
                <div className="bg-slate-650 px-6 py-4 border-b border-slate-600">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-yellow-500 rounded-full inline-block"></span>
                    Product Specifications
                  </h4>
                </div>
                {productData.specifications &&
                Object.keys(productData.specifications).length > 0 ? (
                  <div className="divide-y divide-slate-600/80">
                    {Object.entries(productData.specifications).map(
                      ([key, value], idx) => (
                        <div
                          key={key}
                          className={`grid grid-cols-3 px-6 py-4 text-sm transition-colors ${
                            idx % 2 === 0 ? "bg-slate-700/30" : "bg-slate-800/10"
                          } hover:bg-slate-600/30`}
                        >
                          <span className="col-span-1 font-semibold text-slate-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="col-span-2 text-white font-medium">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-slate-400">No specifications available.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <ProductReviews
                productId={productData._id}
                reviews={productData.reviews}
              />
            )}
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          category={productData.category}
          currentProductId={productData._id}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
