import { Link } from "react-router-dom";
import { MessageSquare, ArrowLeft, Heart } from "lucide-react";

const SocialComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 py-16 px-4">
      <div className="max-w-md w-full text-center bg-slate-700 p-8 rounded-2xl border border-slate-600 shadow-xl space-y-6 animate-fade-in-up">
        <div className="mx-auto w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-400/20 flex items-center justify-center">
          <MessageSquare className="h-8 w-8 text-yellow-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Social Channels Coming Soon</h1>
          <p className="text-sm text-slate-300">
            We are currently setting up our social media. It will be available soon for you all to stay in touch with us!
          </p>
        </div>

        <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-600 flex items-center justify-center gap-2 text-xs text-slate-300">
          <Heart className="h-4 w-4 text-red-500 animate-pulse" />
          <span>Thank you for your patience and support!</span>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="btn-primary w-full inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SocialComingSoon;
