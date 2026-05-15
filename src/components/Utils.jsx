// Utils.jsx — Premium Redesign
import { FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi'

export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-12 h-12 border-[3px] border-violet-100 dark:border-violet-900/30 rounded-full" />
        <div className="absolute inset-0 w-12 h-12 border-[3px] border-violet-600 rounded-full animate-spin border-t-transparent" />
      </div>
      <p className="mt-5 text-sm text-gray-400 dark:text-gray-500 font-medium tracking-wide">Loading...</p>
    </div>
  )
}

export function ErrorAlert({ message, onClose }) {
  return (
    <div className="flex items-start gap-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4 mb-4">
      <div className="w-8 h-8 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <FiAlertCircle className="w-4 h-4 text-red-500" />
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm text-red-700 dark:text-red-400 font-medium">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20">
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export function SuccessAlert({ message, onClose }) {
  return (
    <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 mb-4">
      <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
        <FiCheckCircle className="w-4 h-4 text-emerald-500" />
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-emerald-400 hover:text-emerald-600 transition-colors p-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20">
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export function ScrollableTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-1 mb-8 bg-gray-50 dark:bg-white/3 rounded-2xl p-1.5 border border-gray-100 dark:border-white/5 w-full sm:w-fit">
      <div className="flex min-w-full sm:min-w-0 gap-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onTabChange(id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 whitespace-nowrap ${activeTab === id
            ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
            : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
            }`}>
            {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}