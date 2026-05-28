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
  Search,
} from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto container-padding py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info with same ShopEase logo as header */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3 group">
              <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Store className="text-slate-800 h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-yellow-400">
                  ShopEase
                </span>
                <span className="text-[10px] text-slate-400 -mt-1 font-medium">
                  Premium Store
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 mb-4">
              Your one‑stop destination for quality products at unbeatable
              prices. Fast, secure delivery across India.
            </p>

            <div className="flex items-center gap-3">
              <Link
                to="/social-setup"
                className="text-slate-400 hover:text-yellow-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Link>
              <Link
                to="/social-setup"
                className="text-slate-400 hover:text-yellow-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                to="/social-setup"
                className="text-slate-400 hover:text-yellow-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-yellow-400" />
              Quick Links
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/products"
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <LayoutGrid className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                  <span>All Products</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Electronics"
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <Cpu className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                  <span>Electronics</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Clothing"
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <Shirt className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                  <span>Clothing</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=Books"
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <BookOpen className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                  <span>Books</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/products?featured=true"
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <Award className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                  <span>Featured Products</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-yellow-400" />
              Customer Service
            </h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/contact"
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                  <span>FAQ</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <Truck className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                  <span>Shipping Info</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                  <span>Returns & Exchanges</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-slate-800 text-xs text-slate-300 hover:text-yellow-400 transition-all duration-200"
                >
                  <Search className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                  <span>Track Order</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-3">
              Contact Info
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-yellow-400 shrink-0" />
                <a
                  href="https://maps.google.com/?q=D-45+Hari+Tenament,+Vadodara,+390019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 transition-colors break-words"
                >
                  D-45 Hari Tenament, Vadodara, 390019
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-yellow-400 shrink-0" />
                <a href="tel:+917575841397" className="hover:text-yellow-400 transition-colors break-all">
                  +91 7575841397
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-yellow-400 shrink-0" />
                <a href="mailto:abhishekjha2707@gmail.com" className="hover:text-yellow-400 transition-colors break-all">
                  abhishekjha2707@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs">
              © {year} ShopEase. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="/privacy"
                className="py-1 px-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-yellow-400 text-xs transition-all duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="py-1 px-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-yellow-400 text-xs transition-all duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/refund-policy"
                className="py-1 px-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-yellow-400 text-xs transition-all duration-200"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
