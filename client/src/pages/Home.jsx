"use client";

import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Truck,
  Shield,
  Headphones,
  Star,
  TrendingUp,
  Users,
  Award,
  Smartphone,
  Shirt,
  Book,
  HomeIcon,
  Dumbbell,
  Sparkles,
  Car,
  Baby,
} from "lucide-react";
import { productsAPI } from "../services/api";
import ProductCard from "../components/Product/ProductCard";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useState, useEffect } from "react";

const Home = () => {
  const { data: featuredProducts, isLoading } = useQuery(
    "featuredProducts",
    productsAPI.getFeaturedProducts
  );

  const { data: allProductsRes } = useQuery(
    "allProductsHome",
    () => productsAPI.getProducts({ limit: 50 })
  );

  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const updateVisibleCount = () => {
      const grid = document.querySelector(".product-grid");
      if (grid) {
        const gridCols = window.getComputedStyle(grid).getPropertyValue("grid-template-columns");
        const colCount = gridCols.split(" ").filter(Boolean).length;
        if (colCount > 0) {
          const target = 8;
          const remainder = target % colCount;
          const needed = remainder === 0 ? target : target + (colCount - remainder);
          setVisibleCount(needed);
        }
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    const timeout = setTimeout(updateVisibleCount, 150);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
      clearTimeout(timeout);
    };
  }, [featuredProducts]);

  const getDisplayProducts = () => {
    const featured = featuredProducts?.data || [];
    if (featured.length === 0) return [];
    
    const displayList = [...featured];
    if (displayList.length >= visibleCount) {
      return displayList.slice(0, visibleCount);
    }
    
    const extraNeeded = visibleCount - displayList.length;
    const allProdList = allProductsRes?.data?.products || [];
    const nonFeatured = allProdList.filter(
      (p) => !featured.some((fp) => fp._id === p._id)
    );
    
    for (let i = 0; i < extraNeeded; i++) {
      if (nonFeatured.length > 0) {
        displayList.push(nonFeatured[i % nonFeatured.length]);
      } else {
        displayList.push(featured[i % featured.length]);
      }
    }
    return displayList;
  };

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=1080&fit=crop&q=80",
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1920&h=1080&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop&q=80",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const categories = [
    {
      name: "Electronics",
      icon: Smartphone,
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
      link: "/products?category=Electronics",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      name: "Clothing",
      icon: Shirt,
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      link: "/products?category=Clothing",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      name: "Books",
      icon: Book,
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      link: "/products?category=Books",
      color: "from-slate-500 to-slate-600",
    },
    {
      name: "Home & Garden",
      icon: HomeIcon,
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      link: "/products?category=Home%20%26%20Garden",
      color: "from-yellow-600 to-orange-500",
    },
    {
      name: "Sports",
      icon: Dumbbell,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      link: "/products?category=Sports",
      color: "from-emerald-600 to-teal-500",
    },
    {
      name: "Beauty",
      icon: Sparkles,
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      link: "/products?category=Beauty",
      color: "from-yellow-500 to-amber-500",
    },
    {
      name: "Toys",
      icon: Baby,
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      link: "/products?category=Toys",
      color: "from-emerald-500 to-green-500",
    },
    {
      name: "Automotive",
      icon: Car,
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
      link: "/products?category=Automotive",
      color: "from-slate-600 to-gray-600",
    },
  ];

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Customers" },
    { icon: Award, value: "10K+", label: "Products Sold" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: TrendingUp, value: "99%", label: "Satisfaction Rate" },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden h-[75vh] min-h-[500px]">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Hero background ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 to-slate-900/80"></div>

        <div className="relative max-w-7xl mx-auto container-padding section-spacing h-full flex items-center">
          <div className="text-center animate-fade-in-up w-full">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Discover Amazing Products at{" "}
              <span className="gradient-text bg-gradient-to-r from-yellow-400 to-emerald-400 bg-clip-text text-transparent">
                Unbeatable Prices
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Shop from thousands of products across electronics, fashion,
              books, and more. Fast shipping, secure checkout, and 24/7 customer
              support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/products"
                className="btn-primary text-base px-8 py-3.5 shadow-2xl hover:shadow-3xl transform hover:scale-105"
              >
                Shop Now
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
              <Link
                to="/products?featured=true"
                className="btn-outline border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-800 text-base px-8 py-3.5"
              >
                View Featured Products
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex
                  ? "bg-yellow-400 scale-125"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="py-12 bg-slate-700 border-b border-slate-600">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-14 h-14 mx-auto mb-4 bg-yellow-400 bg-opacity-20 rounded-2xl flex items-center justify-center group-hover:bg-yellow-400 group-hover:bg-opacity-30 transition-colors duration-300">
                  <stat.icon className="h-7 w-7 text-yellow-400" />
                </div>
                <div
                  className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-slate-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-slate-800">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Why Choose ShopEase?
            </h2>
            <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto">
              We're committed to providing you with the best shopping experience
              possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card hover-lift text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <Truck className="h-8 w-8 text-slate-800" />
              </div>
              <h3
                className="text-lg md:text-xl font-bold mb-3 text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Free Shipping
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Free shipping on orders over ₹500
              </p>
            </div>

            <div className="card hover-lift text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3
                className="text-lg md:text-xl font-bold mb-3 text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Secure Payment
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Your payment information is encrypted and secure with
                industry-standard SSL protection.
              </p>
            </div>

            <div className="card hover-lift text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3
                className="text-lg md:text-xl font-bold mb-3 text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                24/7 Support
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Get help whenever you need it with our round-the-clock customer
                support team.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-slate-700">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-400 bg-opacity-20 text-yellow-400 rounded-full text-xs font-semibold mb-4">
              <Star className="h-4 w-4 mr-2" />
              Featured Products
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Handpicked for You
            </h2>
            <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto">
              Discover our carefully selected products, chosen for their
              exceptional quality, value, and customer satisfaction.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="product-grid">
              {getDisplayProducts().map((product, index) => (
                <ProductCard key={`${product._id}-${index}`} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary text-base px-8 py-3.5 shadow-lg hover:shadow-xl"
            >
              View All Products
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-slate-800">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Shop by Category
            </h2>
            <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto">
              Find exactly what you're looking for in our comprehensive product
              categories.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.name}
                  to={category.link}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="aspect-square relative">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
                    ></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                      <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-7 w-7" />
                      </div>
                      <h3
                        className="text-lg font-bold text-center"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-400 bg-opacity-20 text-yellow-400 rounded-full text-xs font-semibold mb-4">
              <Sparkles className="h-4 w-4 mr-2" />
              Testimonials
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What Our Customers Say
            </h2>
            <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto">
              Read real reviews from our satisfied shoppers who experienced our premium service and fast shipping.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Aarav Sharma",
                role: "Verified Buyer",
                rating: 5,
                comment: "Absolutely love the Samsung Galaxy Watch 6 I ordered! The fast delivery (just 2 days to Bengaluru) and excellent packaging were top-notch. Highly recommend ShopEase!",
                date: "May 15, 2026",
              },
              {
                name: "Priya Patel",
                role: "Verified Buyer",
                rating: 5,
                comment: "Free shipping over ₹500 is a fantastic deal. The support team answered my questions about returns instantly, and the quality of the premium bedding set exceeded my expectations.",
                date: "May 20, 2026",
              },
              {
                name: "Rohan Das",
                role: "Verified Buyer",
                rating: 5,
                comment: "Best online shopping experience so far! The website is super clean, quick, and checkout was extremely secure. The luxury skincare set was authentic and cheaper than other platforms.",
                date: "May 24, 2026",
              },
            ].map((review, i) => (
              <div key={i} className="bg-slate-800 rounded-2xl border border-slate-700 p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-4">
                    {Array.from({ length: review.rating }).map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 italic mb-6 leading-relaxed">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-700 pt-4 mt-auto">
                  <div>
                    <h4 className="text-white font-semibold text-base">{review.name}</h4>
                    <span className="text-[10px] text-yellow-400 font-medium">{review.role}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
