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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <div className="bg-slate-700 rounded-2xl shadow-sm border border-slate-600 p-6 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1
                className="text-xl sm:text-2xl font-bold text-slate-100 mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {search ? (
                  <>
                    Search Results for{" "}
                    <span className="text-yellow-400">{search}</span>
                  </                  >
                ) : category ? (
                  category
                ) : (
                  "All Products"
                )}
              </h1>
              {data && (
                <div className="flex items-center space-x-4">
                  <p className="text-xs sm:text-sm text-slate-300 flex items-center space-x-1.5">
                    <Package className="h-4 w-4 text-slate-400 shrink-0" />
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
                      className="text-yellow-400 hover:text-yellow-300 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-slate-600 transition-all duration-200"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* View Mode Toggle */}
              <div className="hidden md:flex items-center bg-slate-600 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 sm:p-3 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-yellow-400 text-slate-800 shadow-sm"
                      : "text-slate-300 hover:text-yellow-400 hover:bg-slate-500"
                  }`}
                  title="Grid View"
                >
                  <Grid className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 sm:p-3 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-yellow-400 text-slate-800 shadow-sm"
                      : "text-slate-300 hover:text-yellow-400 hover:bg-slate-500"
                  }`}
                  title="List View"
                >
                  <List className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </button>
              </div>
 
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-slate-600 border-2 border-slate-500 text-slate-100 rounded-xl px-4 py-2.5 pr-10 sm:px-6 sm:py-3 sm:pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-xs sm:text-sm font-semibold min-w-[130px] sm:min-w-48"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowUpDown className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                </div>
              </div>
 
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center btn-primary p-2.5 sm:px-6 sm:py-3 relative text-xs sm:text-sm"
              >
                <SlidersHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-semibold hidden sm:inline ml-2">Filters</span>
                {(searchParams.get("category") ||
                  searchParams.get("minPrice") ||
                  searchParams.get("rating") ||
                  searchParams.get("brand")) && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] sm:text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold animate-pulse">
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
            className={`lg:w-80 lg:sticky lg:top-36 lg:self-start ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <ProductFilters
              searchParams={searchParams}
              updateSearchParams={updateSearchParams}
              onClose={() => setShowFilters(false)}
              productCounts={data?.data?.productCounts}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1 lg:sticky lg:top-36 lg:self-start">
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
                    (viewMode === "grid" || isMobile)
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {data?.data?.products?.map((product, index) => (
                    <div
                      key={product._id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ProductCard product={product} viewMode={isMobile ? "grid" : viewMode} />
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
