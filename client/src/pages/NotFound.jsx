import { Link } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-800 py-16 px-4">
      <div className="max-w-xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-yellow-400 drop-shadow-md">404</h1>
          <h2 className="text-3xl font-bold text-white mt-4">Page Not Found</h2>
          <p className="text-slate-300 mt-2">Sorry, the page you are looking for doesn't exist or has been moved.</p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <Link to="/" className="btn-primary inline-flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary inline-flex items-center">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <h3 className="text-xl font-semibold text-white mb-6">Popular Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/products" className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl p-4 transition-all hover:scale-105 block text-center">
              <span className="text-yellow-400 font-semibold block mb-1">Store</span>
              <span className="text-xs text-slate-300 block">Browse Products</span>
            </Link>
            <Link to="/login" className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl p-4 transition-all hover:scale-105 block text-center">
              <span className="text-yellow-400 font-semibold block mb-1">Access</span>
              <span className="text-xs text-slate-300 block">Sign In</span>
            </Link>
            <Link to="/register" className="bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-xl p-4 transition-all hover:scale-105 block text-center">
              <span className="text-yellow-400 font-semibold block mb-1">Register</span>
              <span className="text-xs text-slate-300 block">Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
