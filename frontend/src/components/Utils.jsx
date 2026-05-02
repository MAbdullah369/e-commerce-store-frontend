// Utils.jsx
import { FiAlertCircle, FiCheckCircle, FiX, FiLoader } from 'react-icons/fi'

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div>
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-accent-300 rounded-full animate-spin-slow border-b-transparent"></div>
      </div>
      <p className="mt-6 text-gray-500 font-medium tracking-wide">Loading...</p>
    </div>
  )
}

export function ErrorAlert({ message, onClose }) {
  return (
    <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 rounded-r-2xl p-4 mb-4 animate-slide-in-right shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
          <FiAlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm text-red-700 font-medium">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-100">
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export function SuccessAlert({ message, onClose }) {
  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 rounded-r-2xl p-4 mb-4 animate-slide-in-right shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
          <FiCheckCircle className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm text-emerald-700 font-medium">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="flex-shrink-0 text-emerald-400 hover:text-emerald-600 transition-colors p-1 rounded-lg hover:bg-emerald-100">
            <FiX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}