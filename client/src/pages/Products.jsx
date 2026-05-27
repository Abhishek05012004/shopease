"use client";

import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useSearchParams } from "react-router-dom";
import {
  Grid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  X,
  ChevronRight,
  Package,
} from "lucide-react";
import { productsAPI } from "../services/api";
import ProductCard from "../components/Product/ProductCard";
import ProductFilters from "../components/Product/ProductFilters";
import Pagination from "../components/UI/Pagination";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Get query parameters
  const page = Number.parseInt(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const rating = searchParams.get("rating") || "";
  const brand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "popular";

  // Build query object
  const queryParams = {
    page,
    limit: 12,
    ...(category && { category }),
    ...(search && { search }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(rating && { rating }),
    ...(brand && { brand }),
    sort,
  };

  const { data, isLoading, error } = useQuery(
    ["products", queryParams],
    () => productsAPI.getProducts(queryParams),
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category, search, page]);

  const updateSearchParams = (newParams) => {
    const updatedParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        updatedParams.set(key, value);
      } else {
        updatedParams.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (Object.keys(newParams).some((key) => key !== "page")) {
      updatedParams.set("page", "1");
    }

    setSearchParams(updatedParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSort) => {
    updateSearchParams({ sort: newSort });
  };

  const handlePageChange = (newPage) => {
    updateSearchParams({ page: newPage });
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto container-padding section-spacing">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <X className="h-10 w-10 text-red-600" />
          </div>
          <h3
            className="text-2xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Something went wrong
          </h3>
          <p className="text-red-600 mb-8 text-lg">
            Error loading products. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-8 py-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800">
      <div className="max-w-7xl mx-auto container-padding py-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-slate-400 mb-8">
          <span className="hover:text-yellow-400 cursor-pointer transition-colors">
            Home
          </span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-yellow-400 font-semibold">Products</span>
          {category && (
            <>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-yellow-400 font-semibold">{category}</span>
            </>
          )}
        </nav>

        {/* Header Section */}
        <div className="bg-slate-700 rounded-2xl shadow-sm border border-slate-600 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1
                className="text-4xl font-bold text-slate-100 mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {search ? (
                  <>
                    Search Results for{" "}
                    <span className="text-yellow-400">{search}</span>
                  </>
                ) : category ? (
                  category
                ) : (
                  "All Products"
                )}
              </h1>
              {data && (
                <div className="flex items-center space-x-4">
                  <p className="text-slate-300 flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>
                      Showing{" "}
                      <span className="font-semibold text-yellow-400">
                        {data.data.products.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-yellow-400">
                        {data.data.totalProducts}
                      </span>{" "}
                      products
                    </span>
                  </p>
                  {(category || search) && (
                    <button
                      onClick={() => setSearchParams({})}
                      className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold px-3 py-1 rounded-lg hover:bg-slate-600 transition-all duration-200"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-600 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-yellow-400 text-slate-800 shadow-sm"
                      : "text-slate-300 hover:text-yellow-400 hover:bg-slate-500"
                  }`}
                  title="Grid View"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-yellow-400 text-slate-800 shadow-sm"
                      : "text-slate-300 hover:text-yellow-400 hover:bg-slate-500"
                  }`}
                  title="List View"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-slate-600 border-2 border-slate-500 text-slate-100 rounded-xl px-6 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-sm font-semibold min-w-48"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <div className="absolute right-4 top-4 pointer-events-none">
                  <ArrowUpDown className="h-5 w-5 text-slate-400" />
                </div>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-3 btn-primary px-6 py-3 relative"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span className="font-semibold">Filters</span>
                {(searchParams.get("category") ||
                  searchParams.get("minPrice") ||
                  searchParams.get("rating") ||
                  searchParams.get("brand")) && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    !
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="sticky top-24">
              <ProductFilters
                searchParams={searchParams}
                updateSearchParams={updateSearchParams}
                onClose={() => setShowFilters(false)}
                productCounts={data?.data?.productCounts}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="text-center">
                  <div className="loading-spinner mx-auto mb-6"></div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    Loading Products
                  </h3>
                  <p className="text-slate-300">
                    Finding amazing products for you...
                  </p>
                </div>
              </div>
            ) : data?.data?.products?.length === 0 ? (
              <div className="bg-slate-700 rounded-2xl shadow-sm border border-slate-600 p-12 text-center">
                <div className="w-32 h-32 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="h-16 w-16 text-slate-400" />
                </div>
                <h3
                  className="text-2xl font-bold text-slate-100 mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  No products found
                </h3>
                <p className="text-slate-300 text-lg mb-8 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Try
                  adjusting your filters or search terms.
                </p>
                <div className="space-y-4">
                  <button
                    onClick={() => setSearchParams({})}
                    className="btn-primary px-8 py-4"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Products Grid/List */}
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {data?.data?.products?.map((product, index) => (
                    <div
                      key={product._id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {data?.data?.totalPages > 1 && (
                  <div className="mt-16 flex justify-center">
                    <div className="bg-slate-700 rounded-2xl shadow-sm border border-slate-600 p-4">
                      <Pagination
                        currentPage={data.data.currentPage}
                        totalPages={data.data.totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
