import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/contact", formData);
      setIsSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-3">Contact Us</h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            Have queries, feedback, or need help? Get in touch with our team. We're here to assist you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Contact Details Card */}
          <div className="bg-slate-700 p-5 md:p-6 rounded-2xl border border-slate-600 shadow-lg space-y-5 lg:col-span-1">
            <h2 className="text-sm md:text-lg font-bold text-white mb-3 md:mb-4">Support Channels</h2>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 md:h-5 w-5 text-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Us</h3>
                <p className="text-xs sm:text-sm md:text-base font-medium text-white mt-0.5 break-all">
                  <a href="mailto:abhishekjha2707@gmail.com" className="hover:text-yellow-400 transition-colors">
                    abhishekjha2707@gmail.com
                  </a>
                </p>
                <p className="text-[10px] md:text-xs text-slate-300 mt-0.5">Response within 24 hours</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
                <Phone className="h-4 w-4 md:h-5 w-5 text-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Call Us</h3>
                <p className="text-xs sm:text-sm md:text-base font-medium text-white mt-0.5 break-all">
                  <a href="tel:+917575841397" className="hover:text-yellow-400 transition-colors">
                    +91 7575841397
                  </a>
                </p>
                <p className="text-[10px] md:text-xs text-slate-300 mt-0.5">Mon - Sat, 9:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl gradient-accent flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 md:h-5 w-5 text-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">Headquarters</h3>
                <p className="text-xs sm:text-sm md:text-base font-medium text-white mt-0.5">ShopEase Premium Store</p>
                <p className="text-[10px] md:text-xs text-slate-300 mt-0.5 break-words">
                  <a
                    href="https://maps.google.com/?q=D-45+Hari+Tenament,+Vadodara,+390019"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-400 transition-colors"
                  >
                    D-45 Hari Tenament, Vadodara, 390019
                  </a>
                </p>
              </div>
            </div>

            <div className="pt-3 md:pt-4 border-t border-slate-600">
              <p className="text-[9px] md:text-xs text-slate-400 text-center leading-relaxed">
                *Please note: ShopEase has a strict final sale policy. Order cancellations, returns, or exchange requests are not accepted.
              </p>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-slate-700 p-5 md:p-6 rounded-2xl border border-slate-600 shadow-lg lg:col-span-2">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500 animate-bounce">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Thank You!</h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-md">
                  Your message has been successfully received. Our support executives are reviewing it and will get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setFormData({ name: "", email: "", subject: "", message: "" });
                    setIsSubmitted(false);
                  }}
                  className="btn-outline px-3 py-1.5 md:px-4 md:py-2 text-xs sm:text-sm md:text-base"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-sm md:text-lg font-bold text-white mb-3 md:mb-4">Send Us a Message</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="form-label text-xs md:text-sm">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="form-input text-xs sm:text-sm md:text-base px-3 py-1.5 md:py-2.5"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="form-label text-xs md:text-sm">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="form-input text-xs sm:text-sm md:text-base px-3 py-1.5 md:py-2.5"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="form-label text-xs md:text-sm">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Query regarding my order status"
                    className="form-input text-xs sm:text-sm md:text-base px-3 py-1.5 md:py-2.5"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="form-label text-xs md:text-sm">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="form-input text-xs sm:text-sm md:text-base px-3 py-1.5 md:py-2.5 resize-none"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 md:px-5 md:py-2.5 text-xs sm:text-sm md:text-base"
                  >
                    {isSubmitting ? (
                      <span className="spinner"></span>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 md:h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
