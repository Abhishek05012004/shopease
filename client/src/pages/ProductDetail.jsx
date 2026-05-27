"use client";

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
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-slate-400"
        }`}
      />
    ));
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
            <h1 className="text-3xl font-bold text-white mb-4">
              {productData.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {renderStars(productData.rating)}
              </div>
              <span className="text-slate-300">
                ({productData.numReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-yellow-400">
                ₹{productData.price}
              </span>
              {productData.originalPrice > productData.price && (
                <span className="text-xl text-slate-400 line-through">
                  ₹{productData.originalPrice}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {productData.stock > 0 ? (
                <span className="text-emerald-400 font-medium">
                  In Stock ({productData.stock} available)
                </span>
              ) : (
                <span className="text-red-400 font-medium">Out of Stock</span>
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
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Go to Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={productData.stock === 0}
                  className={`flex-1 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center ${
                    productData.stock === 0
                      ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                      : !isAuthenticated
                      ? "bg-slate-600 hover:bg-slate-500 text-white border border-slate-500"
                      : "bg-yellow-500 hover:bg-yellow-600 text-slate-900"
                  }`}
                >
                  {!isAuthenticated && <Lock className="h-5 w-5 mr-2" />}
                  {!isAuthenticated ? "Login to Add to Cart" : "Add to Cart"}
                </button>
              )}
              <button
                onClick={handleWishlistToggle}
                className={`font-semibold py-3 px-6 rounded-lg border transition-colors flex items-center justify-center ${
                  isInWishlist(productData._id)
                    ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                    : "bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                }`}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${
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
                <RotateCcw className="h-5 w-5 text-yellow-400" />
                <span>Easy Returns</span>
              </div>
            </div>

            {/* Product Details - Premium Info Cards */}
            <div className="border-t border-slate-700 pt-6 mt-8">
              <h3 className="font-semibold text-white mb-4 text-lg">Product Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 bg-opacity-40 p-4 rounded-xl border border-slate-600 text-center">
                  <span className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Brand</span>
                  <span className="text-white font-semibold text-base">{productData.brand || "N/A"}</span>
                </div>
                <div className="bg-slate-700 bg-opacity-40 p-4 rounded-xl border border-slate-600 text-center">
                  <span className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Category</span>
                  <span className="text-white font-semibold text-base">{productData.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mb-16">
          <div className="border-b border-slate-600">
            <nav className="flex space-x-8">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
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
              <div className="prose max-w-none">
                <p className="text-slate-300 leading-relaxed">
                  {productData.description}
                </p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                {productData.specifications &&
                Object.keys(productData.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(productData.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-slate-600"
                        >
                          <span className="font-medium capitalize text-white">
                            {key}:
                          </span>
                          <span className="text-slate-300">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-slate-400">No specifications available.</p>
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
