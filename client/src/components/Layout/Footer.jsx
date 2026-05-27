import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Store,
  ShoppingBag,
  HelpCircle,
  Truck,
  RotateCcw,
  LayoutGrid,
  Cpu,
  Shirt,
  BookOpen,
  Award,
  MessageSquare,
  Ruler,
} from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto container-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info with same ShopEase logo as header */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-12 h-12 gradient-accent rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Store className="text-slate-800 h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-yellow-400">
                  ShopEase
                </span>
                <span className="text-xs text-slate-400 -mt-1 font-medium">
                  Premium Store
                </span>
              </div>
            </Link>

            <p className="text-slate-400 mb-5">
              Your one‑stop destination for quality products at unbeatable
              prices. Fast, secure delivery across India.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-yellow-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-yellow-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-yellow-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-yellow-400" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <LayoutGrid className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>All Products</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Electronics"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <Cpu className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>Electronics</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Clothing"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <Shirt className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>Clothing</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Books"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <BookOpen className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>Books</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?featured=true"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <Award className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>Featured Products</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-yellow-400" />
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <MessageSquare className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>Contact Us</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <HelpCircle className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>FAQ</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <Truck className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>Shipping Info</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <RotateCcw className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>Returns & Exchanges</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <Ruler className="h-4 w-4 text-yellow-400 shrink-0" />
                  <span>Size Guide</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-yellow-400" />
                <span>123 Commerce St, Bengaluru, KA 560001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-yellow-400" />
                <span>+91 80 1234 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-yellow-400" />
                <span>support@shopease.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {year} ShopEase. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="py-1 px-2 rounded hover:bg-slate-800 text-slate-400 hover:text-yellow-400 text-sm transition-all duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="py-1 px-2 rounded hover:bg-slate-800 text-slate-400 hover:text-yellow-400 text-sm transition-all duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="py-1 px-2 rounded hover:bg-slate-800 text-slate-400 hover:text-yellow-400 text-sm transition-all duration-200"
              >
                Refund Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
