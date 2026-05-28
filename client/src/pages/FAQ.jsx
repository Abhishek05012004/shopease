import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-600 rounded-xl overflow-hidden bg-slate-700 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left text-white font-semibold hover:bg-slate-600/50 transition-colors text-sm sm:text-base"
      >
        <span className="flex items-center gap-2.5">
          <HelpCircle className="h-4 w-4 text-yellow-400 shrink-0" />
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-yellow-400 shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-yellow-400 shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="p-3.5 sm:p-4 border-t border-slate-600 bg-slate-800/40 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const categories = [
    {
      title: "Cancellation & Returns Policy",
      items: [
        {
          question: "Can I cancel my order once placed?",
          answer: "No, orders cannot be cancelled once placed. Our system initiates immediate packaging and fulfillment workflow to ensure the fastest delivery timelines. Please check your order details carefully before making a payment.",
        },
        {
          question: "Why does ShopEase not support returns or exchanges?",
          answer: "To ensure maximum quality, freshness, and genuine product guarantee, all ShopEase products go through strict multi-point physical quality inspections prior to packing. This ensures we never deliver damaged or defective goods. In order to keep prices highly competitive and avoid losses due to buyer's remorse or purposeful product usage and return, we enforce a strict final sale policy. Under no circumstances do we accept returns or exchanges.",
        },
        {
          question: "What if I entered an incorrect delivery address?",
          answer: "Please contact our customer support at abhishekjha2707@gmail.com or call us immediately. If the order has not been dispatched, our team will update your delivery details. Once dispatched, the shipping destination cannot be altered.",
        },
      ],
    },
    {
      title: "Payment & Checkout",
      items: [
        {
          question: "What payment options are available?",
          answer: "We support multiple secure payment gateways including UPI, Credit Cards, Debit Cards, NetBanking, Mobile Wallets, and Cash on Delivery (COD) for eligible pin codes.",
        },
        {
          question: "My payment failed but money was deducted. What should I do?",
          answer: "In case of failed transaction deductions, the amount is automatically refunded by your banking partner to the original source account within 5-7 business days. You can contact abhishekjha2707@gmail.com with the transaction reference for clarification.",
        },
      ],
    },
    {
      title: "Shipping & Tracking",
      items: [
        {
          question: "How long does shipping take?",
          answer: "For tier-1 cities across India, delivery takes 2-4 business days. For other parts of India, standard delivery takes 4-7 business days. Delivery times may vary slightly due to festive delays or remote accessibility constraints.",
        },
        {
          question: "How can I track my order?",
          answer: "You can track the live delivery status of your package using our dedicated 'Track Order' tool in the customer service footer section by inputting your unique Order ID. We also send SMS and Email updates containing direct tracking links once your package is dispatched.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-sm sm:text-base text-slate-300">
            Find answers to commonly asked questions about payments, delivery, and our policies.
          </p>
        </div>

        <div className="space-y-8">
          {categories.map((category, catIdx) => (
            <div key={catIdx} className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-yellow-400 border-b border-slate-700 pb-2">
                {category.title}
              </h2>
              <div className="space-y-2">
                {category.items.map((item, itemIdx) => (
                  <FAQItem key={itemIdx} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
