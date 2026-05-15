// NotFound.jsx — Premium Redesign
import { Link } from 'react-router-dom'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-500/5 dark:bg-violet-500/8 rounded-full blur-[100px]" />

      <div className="text-center max-w-lg relative z-10">
        <div className="relative mb-8 inline-block">
          <h1 className="text-[160px] sm:text-[200px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-violet-500/30 rotate-12 hover:rotate-0 transition-transform duration-500">
              <span className="text-4xl">?</span>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-3">Page not found</h2>
        <p className="text-gray-400 dark:text-gray-500 mb-10 leading-relaxed text-sm max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-7 py-3 rounded-2xl font-bold text-sm hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all">
            <FiHome className="w-4 h-4" /> Go Home
          </Link>
          <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 px-7 py-3 rounded-2xl font-bold text-sm border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/8 transition-all">
            <FiArrowLeft className="w-4 h-4" /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}