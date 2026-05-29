import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Bell,
  Store,
  Tag,
  Zap,
  Home,
  Search,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const marqueeText = "Free shipping on orders over ₹500! Limited time offer.";
  const marqueeItems = Array(8).fill(marqueeText);

  return (
    <header className="bg-slate-800 shadow-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="gradient-accent text-slate-800 py-2.5 text-sm font-medium overflow-hidden relative w-full select-none">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          <div className="flex items-center gap-12 shrink-0">
            {marqueeItems.map((text, i) => (
              <span key={`main-${i}`} className="flex items-center gap-2">
                <Zap className="h-4 w-4 fill-current shrink-0" />
                <span>{text}</span>
                <Tag className="h-4 w-4 shrink-0" />
              </span>
            ))}
          </div>
          <div className="flex items-center gap-12 shrink-0" aria-hidden="true">
            {marqueeItems.map((text, i) => (
              <span key={`dup-${i}`} className="flex items-center gap-2">
                <Zap className="h-4 w-4 fill-current shrink-0" />
                <span>{text}</span>
                <Tag className="h-4 w-4 shrink-0" />
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="flex items-center space-x-2 xl:space-x-3 hover-scale group"
          >
            <div className="w-10 h-10 xl:w-12 xl:h-12 gradient-accent rounded-xl xl:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Store className="text-slate-800 h-5 w-5 xl:h-6 xl:w-6" />
            </div>
            <div className="flex flex-col">
              <span
                className="text-lg xl:text-2xl font-bold text-yellow-400"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                ShopEase
              </span>
              <span className="text-[10px] xl:text-xs text-slate-400 -mt-1 font-medium">
                Premium Store
              </span>
            </div>
          </Link>

          <div className="hidden sm:flex flex-1 max-w-md min-w-[280px] mx-4 xl:mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input pr-14 sm:pr-16 py-3 sm:py-4 text-sm sm:text-base bg-slate-700 hover:bg-slate-600 group-hover:scale-[1.02] border-slate-600 focus:border-yellow-400 focus:ring-yellow-100 text-slate-100 placeholder-slate-400 transition-all duration-200 truncate"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 hover:scale-105 text-slate-800 p-2 sm:p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </form>
          </div>

          <nav className="hidden xl:flex items-center space-x-3 xl:space-x-8">
            <Link
              to="/"
              className="flex flex-col items-center text-slate-300 hover:text-yellow-400 font-medium transition-all duration-200 relative group px-2 py-1.5 xl:px-3 xl:py-2 rounded-lg hover:bg-slate-700"
            >
              <Home className="h-4 w-4 xl:h-5 xl:w-5 mb-1" />
              <span className="text-xs xl:text-sm">Home</span>
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-yellow-400 transition-all duration-200 group-hover:w-8"></span>
            </Link>

            <Link
              to="/products"
              className="flex flex-col items-center text-slate-300 hover:text-yellow-400 font-medium transition-all duration-200 relative group px-2 py-1.5 xl:px-3 xl:py-2 rounded-lg hover:bg-slate-700"
            >
              <Store className="h-4 w-4 xl:h-5 xl:w-5 mb-1" />
              <span className="text-xs xl:text-sm">Products</span>
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-yellow-400 transition-all duration-200 group-hover:w-8"></span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 xl:space-x-6">
                <Link
                  to="/orders"
                  className="flex flex-col items-center text-slate-300 hover:text-emerald-400 transition-all duration-200 relative group px-2 py-1.5 xl:px-3 xl:py-2 rounded-lg hover:bg-slate-700"
                >
                  <div className="relative">
                    <Bell className="h-4 w-4 xl:h-5 xl:w-5 mb-1" />
                  </div>
                  <span className="text-xs xl:text-sm font-medium">Orders</span>
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-emerald-400 transition-all duration-200 group-hover:w-8"></span>
                </Link>

                <Link
                  to="/wishlist"
                  className="flex flex-col items-center text-slate-300 hover:text-yellow-400 transition-all duration-200 relative group px-2 py-1.5 xl:px-3 xl:py-2 rounded-lg hover:bg-slate-700"
                >
                  <Heart className="h-4 w-4 xl:h-5 xl:w-5 mb-1" />
                  <span className="text-xs xl:text-sm font-medium">Wishlist</span>
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-yellow-400 transition-all duration-200 group-hover:w-8"></span>
                </Link>

                <Link
                  to="/cart"
                  className="flex flex-col items-center text-slate-300 hover:text-yellow-400 font-medium transition-all duration-200 relative group px-2 py-1.5 xl:px-3 xl:py-2 rounded-lg hover:bg-slate-700"
                >
                  <div className="relative">
                    <ShoppingCart className="h-4 w-4 xl:h-5 xl:w-5 mb-1" />
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-800 text-[10px] xl:text-xs rounded-full h-4 w-4 xl:h-5 xl:w-5 flex items-center justify-center font-bold animate-pulse shadow-lg">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs xl:text-sm font-medium">Cart</span>
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-yellow-400 transition-all duration-200 group-hover:w-8"></span>
                </Link>

                <div className="relative group">
                  <button className="flex flex-col items-center text-slate-300 hover:text-yellow-400 transition-all duration-200 px-2 py-1.5 xl:px-3 xl:py-2 rounded-lg hover:bg-slate-700">
                    <User className="h-4 w-4 xl:h-5 xl:w-5 mb-1" />
                    <span className="text-xs xl:text-sm font-medium max-w-16 xl:max-w-20 truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-6 border-b border-slate-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-400 bg-opacity-20 rounded-full flex items-center justify-center shrink-0">
                          <User className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className="font-semibold text-slate-100 truncate"
                            style={{ fontFamily: "var(--font-heading)" }}
                          >
                            {user?.name}
                          </p>
                          <p className="text-sm text-slate-400 break-all whitespace-normal">
                            {user?.email}
                          </p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-400 bg-opacity-20 text-yellow-400 mt-1">
                            {user?.role === "admin"
                              ? "Administrator"
                              : "Customer"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 transition-colors duration-200"
                      >
                        <User className="h-4 w-4 mr-3" />
                        My Profile
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-yellow-400 transition-colors duration-200"
                        >
                          <Store className="h-4 w-4 mr-3" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-6 py-3 text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition-colors duration-200"
                      >
                        <X className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 xl:space-x-6">
                <Link
                  to="/cart"
                  className="flex flex-col items-center text-slate-300 hover:text-yellow-400 font-medium transition-all duration-200 relative group px-2 py-1.5 xl:px-3 xl:py-2 rounded-lg hover:bg-slate-700"
                >
                  <div className="relative">
                    <ShoppingCart className="h-4 w-4 xl:h-5 xl:w-5 mb-1" />
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-yellow-400 text-slate-800 text-[10px] xl:text-xs rounded-full h-4 w-4 xl:h-5 xl:w-5 flex items-center justify-center font-bold shadow-lg">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </div>
                  <span className="text-xs xl:text-sm font-medium">Cart</span>
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-yellow-400 transition-all duration-200 group-hover:w-8"></span>
                </Link>
                <div className="flex items-stretch bg-slate-700 rounded-lg overflow-hidden h-8 xl:h-10 w-32 xl:w-48">
                  <Link
                    to="/login"
                    className="flex-1 text-slate-300 hover:text-yellow-400 font-semibold transition-all duration-200 flex items-center justify-center hover:bg-slate-600/50 text-xs xl:text-sm"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-slate-800 bg-yellow-400 hover:bg-yellow-300 font-semibold transition-all duration-200 flex items-center justify-center text-xs xl:text-sm"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-3 text-slate-300 hover:text-yellow-400 transition-colors duration-200 rounded-lg hover:bg-slate-700"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className="sm:hidden pb-6">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pr-14 py-3 text-sm bg-slate-700 hover:bg-slate-600 group-hover:scale-[1.02] border-slate-600 focus:border-yellow-400 focus:ring-yellow-100 text-slate-100 placeholder-slate-400 transition-all duration-200 truncate"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 hover:scale-105 text-slate-800 p-2 rounded-lg transition-all duration-200 flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {isMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-slate-800 border-t border-slate-700 shadow-2xl z-50">
          <div className="container-padding py-4 space-y-1">
            <Link
              to="/"
              className="flex items-center py-2.5 px-4 text-slate-300 hover:text-yellow-400 hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-4" />
              Home
            </Link>

            <Link
              to="/products"
              className="flex items-center py-2.5 px-4 text-slate-300 hover:text-yellow-400 hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <Store className="h-5 w-5 mr-4" />
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/orders"
                  className="flex items-center py-2.5 px-4 text-slate-300 hover:text-emerald-400 hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Bell className="h-5 w-5 mr-4" />
                  My Orders
                </Link>
                <Link
                  to="/wishlist"
                  className="flex items-center py-2.5 px-4 text-slate-300 hover:text-yellow-400 hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="h-5 w-5 mr-4" />
                  Wishlist
                </Link>
                <Link
                  to="/cart"
                  className="flex items-center justify-between py-2.5 px-4 text-slate-300 hover:text-yellow-400 hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-4" />
                    Cart
                  </div>
                  {getCartItemsCount() > 0 && (
                    <span className="bg-yellow-400 text-slate-800 text-sm rounded-full h-7 w-7 flex items-center justify-center font-bold shadow-lg">
                      {getCartItemsCount()}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center py-2.5 px-4 text-slate-300 hover:text-yellow-400 hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-4" />
                  Profile
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center py-2.5 px-4 text-slate-300 hover:text-yellow-400 hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Store className="h-4 w-4 mr-4" />
                    Admin Dashboard
                  </Link>
                )}
                <div className="border-t border-slate-700 pt-2 mt-2">
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full py-2.5 px-4 text-red-400 hover:bg-red-900 hover:bg-opacity-20 rounded-xl transition-all duration-200 font-medium"
                  >
                    <X className="h-5 w-5 mr-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/cart"
                  className="flex items-center justify-between py-2.5 px-4 text-slate-300 hover:text-yellow-400 hover:bg-slate-700 rounded-xl transition-all duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-4" />
                    Cart
                  </div>
                  {getCartItemsCount() > 0 && (
                    <span className="bg-yellow-400 text-slate-800 text-sm rounded-full h-7 w-7 flex items-center justify-center font-bold shadow-lg">
                      {getCartItemsCount()}
                    </span>
                  )}
                </Link>
                <div className="border-t border-slate-700 pt-4 mt-2 px-4 pb-4">
                  <div className="flex items-stretch bg-slate-700 rounded-lg overflow-hidden h-10 w-full">
                    <Link
                      to="/login"
                      className="flex-1 text-slate-300 hover:text-yellow-400 font-semibold transition-all duration-200 flex items-center justify-center hover:bg-slate-600/50 text-sm"
                      style={{ fontFamily: "var(--font-heading)" }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="flex-1 text-slate-800 bg-yellow-400 hover:bg-yellow-300 font-semibold transition-all duration-200 flex items-center justify-center text-sm"
                      style={{ fontFamily: "var(--font-heading)" }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
