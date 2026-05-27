"use client";

import { useState } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Star,
  Smartphone,
  Shirt,
  Book,
  Home,
  Dumbbell,
  Sparkles,
  Baby,
  Car,
} from "lucide-react";

const ProductFilters = ({
  searchParams,
  updateSearchParams,
  onClose,
  productCounts,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    rating: true,
    brand: false,
  });

  const categories = [
    {
      name: "Electronics",
      count: productCounts?.categories?.Electronics || 0,
      icon: Smartphone,
      color: "text-blue-600",
    },
    {
      name: "Clothing",
      count: productCounts?.categories?.Clothing || 0,
      icon: Shirt,
      color: "text-purple-600",
    },
    {
      name: "Books",
      count: productCounts?.categories?.Books || 0,
      icon: Book,
      color: "text-green-600",
    },
    {
      name: "Home & Garden",
      count: productCounts?.categories?.["Home & Garden"] || 0,
      icon: Home,
      color: "text-orange-600",
    },
    {
      name: "Sports",
      count: productCounts?.categories?.Sports || 0,
      icon: Dumbbell,
      color: "text-red-600",
    },
    {
      name: "Beauty",
      count: productCounts?.categories?.Beauty || 0,
      icon: Sparkles,
      color: "text-pink-600",
    },
    {
      name: "Toys",
      count: productCounts?.categories?.Toys || 0,
      icon: Baby,
      color: "text-yellow-600",
    },
    {
      name: "Automotive",
      count: productCounts?.categories?.Automotive || 0,
      icon: Car,
      color: "text-gray-600",
    },
  ];

  const priceRanges = [
    {
      label: "Under ₹2,000",
      min: "",
      max: "2000",
      count: productCounts?.priceRanges?.under2000 || 0,
    },
    {
      label: "₹2,000 - ₹5,000",
      min: "2000",
      max: "5000",
      count: productCounts?.priceRanges?.["2000-5000"] || 0,
    },
    {
      label: "₹5,000 - ₹10,000",
      min: "5000",
      max: "10000",
      count: productCounts?.priceRanges?.["5000-10000"] || 0,
    },
    {
      label: "₹10,000 - ₹20,000",
      min: "10000",
      max: "20000",
      count: productCounts?.priceRanges?.["10000-20000"] || 0,
    },
    {
      label: "Over ₹20,000",
      min: "20000",
      max: "",
      count: productCounts?.priceRanges?.over20000 || 0,
    },
  ];

  const ratings = [
    {
      label: "4 Stars & Up",
      value: "4",
      count: productCounts?.ratings?.["4+"] || 0,
    },
    {
      label: "3 Stars & Up",
      value: "3",
      count: productCounts?.ratings?.["3+"] || 0,
    },
    {
      label: "2 Stars & Up",
      value: "2",
      count: productCounts?.ratings?.["2+"] || 0,
    },
    {
      label: "1 Star & Up",
      value: "1",
      count: productCounts?.ratings?.["1+"] || 0,
    },
  ];

  const brands = [
    { name: "Apple", count: productCounts?.brands?.Apple || 0 },
    { name: "Samsung", count: productCounts?.brands?.Samsung || 0 },
    { name: "Nike", count: productCounts?.brands?.Nike || 0 },
    { name: "Adidas", count: productCounts?.brands?.Adidas || 0 },
    { name: "Sony", count: productCounts?.brands?.Sony || 0 },
  ];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category) => {
    const currentCategory = searchParams.get("category");
    let selectedCategories = currentCategory ? currentCategory.split(",") : [];

    if (selectedCategories.includes(category)) {
      selectedCategories = selectedCategories.filter((c) => c !== category);
    } else {
      selectedCategories.push(category);
    }

    updateSearchParams({
      category: selectedCategories.join(","),
    });
  };

  const handlePriceRangeChange = (min, max) => {
    const currentMin = searchParams.get("minPrice");
    const currentMax = searchParams.get("maxPrice");

    let minPrices = currentMin ? currentMin.split(",") : [];
    let maxPrices = currentMax ? currentMax.split(",") : [];

    let index = -1;
    for (let i = 0; i < Math.max(minPrices.length, maxPrices.length); i++) {
      if ((minPrices[i] || "") === min && (maxPrices[i] || "") === max) {
        index = i;
        break;
      }
    }

    if (index > -1) {
      minPrices.splice(index, 1);
      maxPrices.splice(index, 1);
    } else {
      minPrices.push(min);
      maxPrices.push(max);
    }

    updateSearchParams({
      minPrice: minPrices.join(","),
      maxPrice: maxPrices.join(","),
    });
  };

  const isPriceRangeChecked = (min, max) => {
    const currentMin = searchParams.get("minPrice");
    const currentMax = searchParams.get("maxPrice");
    if (!currentMin && !currentMax) return false;

    const minPrices = currentMin ? currentMin.split(",") : [];
    const maxPrices = currentMax ? currentMax.split(",") : [];

    for (let i = 0; i < Math.max(minPrices.length, maxPrices.length); i++) {
      if ((minPrices[i] || "") === min && (maxPrices[i] || "") === max) {
        return true;
      }
    }
    return false;
  };
  const getSelectedPriceRanges = () => {
    const currentMin = searchParams.get("minPrice");
    const currentMax = searchParams.get("maxPrice");
    if (!currentMin && !currentMax) return [];

    const minPrices = currentMin ? currentMin.split(",") : [];
    const maxPrices = currentMax ? currentMax.split(",") : [];
    const selected = [];

    for (let i = 0; i < Math.max(minPrices.length, maxPrices.length); i++) {
      const min = minPrices[i] || "";
      const max = maxPrices[i] || "";
      const range = priceRanges.find((r) => r.min === min && r.max === max);
      selected.push({
        label: range ? range.label : `${min ? `₹${min}` : ""} - ${max ? `₹${max}` : ""}`,
        min,
        max,
      });
    }
    return selected;
  };

  const handleRatingChange = (rating) => {
    const currentRating = searchParams.get("rating");
    let selectedRatings = currentRating ? currentRating.split(",") : [];

    if (selectedRatings.includes(rating)) {
      selectedRatings = selectedRatings.filter((r) => r !== rating);
    } else {
      selectedRatings.push(rating);
    }

    updateSearchParams({
      rating: selectedRatings.join(","),
    });
  };

  const handleBrandChange = (brand) => {
    const currentBrand = searchParams.get("brand");
    let selectedBrands = currentBrand ? currentBrand.split(",") : [];

    if (selectedBrands.includes(brand)) {
      selectedBrands = selectedBrands.filter((b) => b !== brand);
    } else {
      selectedBrands.push(brand);
    }

    updateSearchParams({
      brand: selectedBrands.join(","),
    });
  };

  const clearAllFilters = () => {
    updateSearchParams({
      category: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      brand: "",
      search: "",
    });
  };

  const hasActiveFilters =
    searchParams.get("category") ||
    searchParams.get("minPrice") ||
    searchParams.get("maxPrice") ||
    searchParams.get("rating") ||
    searchParams.get("brand");

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-slate-700 rounded-2xl shadow-sm border border-slate-600 p-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
            <Filter className="h-5 w-5 text-slate-900" />
          </div>
          <h3
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Filters
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-yellow-400 hover:text-yellow-300 font-semibold px-3 py-1 rounded-lg hover:bg-slate-600 transition-all duration-200"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-600 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full text-left font-bold text-white mb-6 hover:text-yellow-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-600"
        >
          <span className="flex items-center space-x-3">
            <span>Category</span>
            {searchParams.get("category") && (
              <span className="bg-yellow-500 text-slate-900 text-xs font-semibold px-2 py-1 rounded-full">
                {searchParams.get("category").split(",").filter(Boolean).length}
              </span>
            )}
          </span>
          {expandedSections.category ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {expandedSections.category && (
          <div className="space-y-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <label
                  key={category.name}
                  className="flex items-center p-3 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={searchParams.get("category")?.split(",")?.includes(category.name) || false}
                    onChange={() => handleCategoryChange(category.name)}
                    className="w-4 h-4 text-yellow-500 bg-slate-600 border-slate-500 rounded focus:ring-yellow-500 focus:ring-2"
                  />
                  <span className="flex items-center justify-between w-full ml-3">
                    <span className="flex items-center space-x-3">
                      <IconComponent className={`h-5 w-5 ${category.color}`} />
                      <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                        {category.name}
                      </span>
                    </span>
                    <span className="bg-slate-600 text-slate-200 text-xs px-2 py-1 rounded-full group-hover:bg-slate-500 group-hover:text-white">
                      ({category.count})
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="mb-8">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left font-bold text-white mb-6 hover:text-yellow-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-600"
        >
          <span className="flex items-center space-x-3">
            <span>Price Range</span>
            {(searchParams.get("minPrice") || searchParams.get("maxPrice")) && (
              <span className="bg-yellow-500 text-slate-900 text-xs font-semibold px-2 py-1 rounded-full">
                {getSelectedPriceRanges().length}
              </span>
            )}
          </span>
          {expandedSections.price ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {expandedSections.price && (
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label
                key={range.label}
                className="flex items-center p-3 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isPriceRangeChecked(range.min, range.max)}
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                  className="w-4 h-4 text-yellow-500 bg-slate-600 border-slate-500 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <span className="flex items-center justify-between w-full ml-3">
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                    {range.label}
                  </span>
                  <span className="bg-slate-600 text-slate-200 text-xs px-2 py-1 rounded-full group-hover:bg-slate-500 group-hover:text-white">
                    ({range.count})
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Rating Filter */}
      <div className="mb-8">
        <button
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between w-full text-left font-bold text-white mb-6 hover:text-yellow-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-600"
        >
          <span className="flex items-center space-x-3">
            <span>Customer Rating</span>
            {searchParams.get("rating") && (
              <span className="bg-yellow-500 text-slate-900 text-xs font-semibold px-2 py-1 rounded-full">
                {searchParams.get("rating").split(",").filter(Boolean).length}
              </span>
            )}
          </span>
          {expandedSections.rating ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {expandedSections.rating && (
          <div className="space-y-2">
            {ratings.map((rating) => (
              <label
                key={rating.value}
                className="flex items-center p-3 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={searchParams.get("rating")?.split(",")?.includes(rating.value) || false}
                  onChange={() => handleRatingChange(rating.value)}
                  className="w-4 h-4 text-yellow-500 bg-slate-600 border-slate-500 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <span className="flex items-center justify-between w-full ml-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(Number.parseInt(rating.value))}
                    </div>
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                      {rating.label}
                    </span>
                  </div>
                  <span className="bg-slate-600 text-slate-200 text-xs px-2 py-1 rounded-full group-hover:bg-slate-500 group-hover:text-white">
                    ({rating.count})
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="mb-8">
        <button
          onClick={() => toggleSection("brand")}
          className="flex items-center justify-between w-full text-left font-bold text-white mb-6 hover:text-yellow-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-600"
        >
          <span className="flex items-center space-x-3">
            <span>Popular Brands</span>
            {searchParams.get("brand") && (
              <span className="bg-yellow-500 text-slate-900 text-xs font-semibold px-2 py-1 rounded-full">
                {searchParams.get("brand").split(",").filter(Boolean).length}
              </span>
            )}
          </span>
          {expandedSections.brand ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>

        {expandedSections.brand && (
          <div className="space-y-2">
            {brands.map((brand) => (
              <label
                key={brand.name}
                className="flex items-center p-3 rounded-lg hover:bg-slate-600 transition-colors cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={searchParams.get("brand")?.split(",")?.includes(brand.name) || false}
                  onChange={() => handleBrandChange(brand.name)}
                  className="w-4 h-4 text-yellow-500 bg-slate-600 border-slate-500 rounded focus:ring-yellow-500 focus:ring-2"
                />
                <span className="flex items-center justify-between w-full ml-3">
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                    {brand.name}
                  </span>
                  <span className="bg-slate-600 text-slate-200 text-xs px-2 py-1 rounded-full group-hover:bg-slate-500 group-hover:text-white">
                    ({brand.count})
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="p-6 bg-slate-600 rounded-xl border border-slate-500">
          <h4
            className="font-bold text-yellow-400 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Active Filters:
          </h4>
          <div className="flex flex-wrap gap-2">
            {searchParams.get("category")?.split(",")?.filter(Boolean).map((cat) => (
              <span key={cat} className="inline-flex items-center px-3 py-2 text-sm font-semibold bg-yellow-500 text-slate-900 rounded-lg">
                {cat}
                <button
                  onClick={() => {
                    const remaining = searchParams.get("category").split(",").filter(c => c !== cat).join(",");
                    updateSearchParams({ category: remaining });
                  }}
                  className="ml-2 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
            {getSelectedPriceRanges().map((range, index) => (
              <span key={index} className="inline-flex items-center px-3 py-2 text-sm font-semibold bg-yellow-500 text-slate-900 rounded-lg">
                {range.label}
                <button
                  onClick={() => handlePriceRangeChange(range.min, range.max)}
                  className="ml-2 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
            {searchParams.get("rating")?.split(",")?.filter(Boolean).map((rat) => (
              <span key={rat} className="inline-flex items-center px-3 py-2 text-sm font-semibold bg-yellow-500 text-slate-900 rounded-lg">
                {rat}+ Stars
                <button
                  onClick={() => {
                    const remaining = searchParams.get("rating").split(",").filter(r => r !== rat).join(",");
                    updateSearchParams({ rating: remaining });
                  }}
                  className="ml-2 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
            {searchParams.get("brand")?.split(",")?.filter(Boolean).map((br) => (
              <span key={br} className="inline-flex items-center px-3 py-2 text-sm font-semibold bg-yellow-500 text-slate-900 rounded-lg">
                {br}
                <button
                  onClick={() => {
                    const remaining = searchParams.get("brand").split(",").filter(b => b !== br).join(",");
                    updateSearchParams({ brand: remaining });
                  }}
                  className="ml-2 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
