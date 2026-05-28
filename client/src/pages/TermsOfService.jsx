const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-sm sm:text-base text-slate-300">
            Last Updated: May 28, 2026. Please read these terms carefully before accessing ShopEase.
          </p>
        </div>

        <div className="bg-slate-700 p-6 rounded-2xl border border-slate-600 shadow-lg space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing, browsing, or using the ShopEase application, you agree to comply with and be bound by these Terms of Service. If you disagree with any segment, please terminate use of our store.
            </p>
          </section>

          <section className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white">2. User Account Security</h2>
            <p>
              To execute checkout flows, users must register accounts. You are solely responsible for protecting password keys and keeping credentials confidential. You agree to immediately report unauthorized account usage.
            </p>
          </section>

          <section className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white">3. Sales Finality Policy</h2>
            <p className="p-3.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl font-medium text-xs sm:text-sm">
              Important: In order to protect ShopEase from buyer abuse, casual orders, or malicious claims, all order contracts are strictly non-cancellable, non-refundable, and non-returnable. By purchasing a product, you agree to waive rights to return products or cancel shipments. Every product undergoes strict multi-stage quality assurance checks prior to packaging.
            </p>
          </section>

          <section className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white">4. Intellectual Property</h2>
            <p>
              All software components, illustrations, layouts, graphics, design assets, and logos of ShopEase are owned exclusively by ShopEase. No duplication, modification, or commercial repackaging is allowed.
            </p>
          </section>

          <section className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white">5. Governing Law</h2>
            <p>
              These Terms and related store operations are governed by and construed in compliance with the laws of India, under Bangalore jurisdiction.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
