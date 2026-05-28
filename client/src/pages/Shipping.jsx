import { Truck, MapPin, Calendar, Clock } from "lucide-react";

const Shipping = () => {
  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">Shipping & Delivery Info</h1>
          <p className="text-sm sm:text-base text-slate-300">
            How we pack, ship, and safely deliver premium products to your doorstep.
          </p>
        </div>

        <div className="bg-slate-700 p-6 rounded-2xl border border-slate-600 shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-slate-880/40 rounded-xl border border-slate-600">
              <Truck className="h-6 w-6 text-yellow-400 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">Verified Delivery</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  We partner with top-tier courier logistics including BlueDart, Delhivery, and Xpressbees for secure transport.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-880/40 rounded-xl border border-slate-600">
              <Calendar className="h-6 w-6 text-yellow-400 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">Delivery Timeline</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Standard dispatch is completed within 24 hours. Transit takes 2-4 days for metro areas and 4-7 days for other regions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-880/40 rounded-xl border border-slate-600">
              <Clock className="h-6 w-6 text-yellow-400 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">Real-Time Tracking</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  We send unique SMS and email tracking links upon package dispatch. You can also trace live status via the Track Order tool.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-880/40 rounded-xl border border-slate-600">
              <MapPin className="h-6 w-6 text-yellow-400 shrink-0" />
              <div>
                <h3 className="text-base font-bold text-white">Shipping Zones</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  We deliver to over 19,000+ PIN codes across India. Delivery availability is automatically checked during checkout.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-600 pt-5 space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white">Shipping Rates</h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              We offer free standard shipping on orders over <span className="text-yellow-400 font-semibold">₹500</span>. For orders below ₹500, a flat shipping charge of <span className="text-yellow-400 font-semibold">₹50</span> is applicable across India.
            </p>
          </div>

          <div className="border-t border-slate-600 pt-5 space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white">Delivery Terms & Product Integrity</h2>
            <div className="text-xs sm:text-sm text-slate-300 space-y-2">
              <p>
                To provide you with the finest shopping experience, our logistics handlers follow premium delivery workflows. All packages are checked for tampering prior to distribution.
              </p>
              <p className="text-yellow-400 font-semibold">
                Important Disclaimer: Due to our zero-defect quality checking system, we inspect every product before it leaves the warehouse. Therefore, all shipments are final-sale, and packages cannot be cancelled or returned under any circumstances.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
