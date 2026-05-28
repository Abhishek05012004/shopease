const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Refund Policy</h1>
          <p className="text-sm sm:text-base text-slate-300">
            Learn about our strict final-sale structure and refund policy conditions.
          </p>
        </div>

        <div className="bg-slate-700 p-6 rounded-2xl border border-slate-600 shadow-lg space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-medium text-xs sm:text-sm">
            Strict Refund Policy: All purchases are final-sale. We do not provide refunds, chargebacks, returns, or credit adjustments for placed orders.
          </div>

          <section className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white">1. Policy Scope</h2>
            <p>
              This policy is active for all catalog departments of ShopEase. Since our warehouses enforce a comprehensive inspection routine checking for quality, tears, damages, or discrepancies prior to shipping, we can guarantee that no damaged products leave our custody.
            </p>
          </section>

          <section className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white">2. No Cancellation Policy</h2>
            <p>
              Once a payment has been registered and verified, order packaging begins instantly to expedite courier transit. As a result, order cancellations are not permitted.
            </p>
          </section>

          <section className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white">3. Exceptional Transactions</h2>
            <p>
              In rare, verified cases where our payment gateway registers double charges or charges without creating a corresponding order record, refunds will be credited automatically back to the payment origin channel within 5-7 business banking days.
            </p>
          </section>

          <section className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white">4. Abuse and Fraud Protection</h2>
            <p>
              We monitor account activities to flag deliberate purchase cancellations, disputes, or return abuse patterns. Accounts found attempting to exploit transaction channels or initiate fraudulent claims will be permanently blacklisted.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
