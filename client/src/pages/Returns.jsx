import { AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Returns = () => {
  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-3">Returns & Exchanges Policy</h1>
          <p className="text-sm md:text-lg text-slate-300">
            Learn about our quality assurance and policy on cancellations, returns, and exchanges.
          </p>
        </div>

        <div className="bg-slate-700 p-6 md:p-8 rounded-2xl border border-slate-600 shadow-lg space-y-6">
          <div className="p-4 md:p-5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-3 md:gap-4">
            <AlertTriangle className="h-5 w-5 md:h-6 w-6 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm md:text-lg font-bold text-yellow-400">Strict Policy: All Sales are Final</h2>
              <p className="text-xs md:text-base text-slate-300 mt-1">
                At ShopEase, we do not accept order cancellations, product returns, or item exchange requests under any circumstances. Once an order is confirmed and placed, it cannot be modified or cancelled.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-base md:text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 md:h-6 w-6 text-emerald-400" />
              Why We Enforce This Policy
            </h2>
            <div className="text-xs md:text-base text-slate-300 space-y-3 leading-relaxed">
              <p>
                We are committed to delivering the highest quality products at the best possible prices. To maintain these standards, we have implemented a strict policy due to the following reasons:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-white">Multi-point Quality Assurance (QA):</strong> Before leaving our fulfillment centers, every single item undergoes a rigorous multi-point physical inspection to guarantee 100% defect-free and perfect condition. We never ship damaged, soiled, or duplicate products.
                </li>
                <li>
                  <strong className="text-white">Fulfillment Costs and Abuse Prevention:</strong> To prevent losses caused by buyer's remorse, casual ordering, or malicious purchase patterns (where products are intentionally ordered, used/worn, and then returned), we treat all purchases as final.
                </li>
                <li>
                  <strong className="text-white">Hygiene & Safety Standards:</strong> For safety and hygiene regulations, several product lines cannot be put back into inventory once shipped.
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-600 pt-6 space-y-4">
            <h2 className="text-base md:text-2xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="h-5 w-5 md:h-6 w-6 text-yellow-400" />
              Need Assistance?
            </h2>
            <p className="text-xs md:text-base text-slate-300 leading-relaxed">
              If you have any doubts regarding sizing, specifications, or product features, please consult our product pages or reach out to our team <strong className="text-white">before</strong> completing your order. We are happy to clear up any questions to make sure you select the correct product.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2 md:pt-3">
              <Link to="/contact" className="btn-primary text-xs sm:text-sm md:text-base px-4 py-2 md:px-6 md:py-2.5 text-center justify-center flex items-center flex-1">
                Contact Customer Support
              </Link>
              <Link to="/products" className="btn-outline text-xs sm:text-sm md:text-base px-4 py-2 md:px-6 md:py-2.5 text-center justify-center flex items-center flex-1">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;
