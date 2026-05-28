import { Shield, Eye, Lock, RefreshCw } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-sm sm:text-base text-slate-300">
            Effective Date: May 28, 2026. Your privacy and trust are our highest priorities.
          </p>
        </div>

        <div className="bg-slate-700 p-6 rounded-2xl border border-slate-600 shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-3 bg-slate-800/40 rounded-xl border border-slate-600">
              <Shield className="h-6 w-6 text-yellow-400 mb-2" />
              <h3 className="text-sm font-bold text-white">Safe Encryption</h3>
              <p className="text-[11px] text-slate-300 mt-1">We secure personal data via 256-bit Secure Socket Layer (SSL) standards.</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-slate-800/40 rounded-xl border border-slate-600">
              <Eye className="h-6 w-6 text-yellow-400 mb-2" />
              <h3 className="text-sm font-bold text-white">Zero Sharing</h3>
              <p className="text-[11px] text-slate-300 mt-1">We never sell, rent, or lease your private profiles to third-party ad networks.</p>
            </div>
            <div className="flex flex-col items-center text-center p-3 bg-slate-800/40 rounded-xl border border-slate-600">
              <Lock className="h-6 w-6 text-yellow-400 mb-2" />
              <h3 className="text-sm font-bold text-white">Strict Protocols</h3>
              <p className="text-[11px] text-slate-300 mt-1">Authorized personnel only have access for processing verified transactions.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <section className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-white">1. Information We Collect</h2>
              <p>
                We collect personal information when you create an account, purchase products, or correspond with us. This details name, email address, shipping destination, payment preferences, and phone numbers.
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-white">2. How We Use Your Information</h2>
              <p>
                We use information to process orders, verify payments, deliver packages, send tracking updates, manage user login profiles, and send product recommendations if opted in.
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-white">3. Third-Party Payment Protection</h2>
              <p>
                We execute payments securely using compliant third-party payment solutions (e.g. Cashfree, credit card aggregators). ShopEase does not store your credit card digits or raw banking credentials.
              </p>
            </section>

            <section className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-white">4. Cookies & Trackers</h2>
              <p>
                Cookies are utilized to save shopping cart contents, active login tokens, and preference filters. You can disable cookie preferences in browser settings, but it may disrupt checkout features.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
