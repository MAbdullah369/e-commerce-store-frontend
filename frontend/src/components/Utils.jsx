export function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  )
}

export function ErrorAlert({ message, onClose }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-red-700 hover:text-red-900">
          ✕
        </button>
      )}
    </div>
  )
}

export function SuccessAlert({ message, onClose }) {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="text-green-700 hover:text-green-900">
          ✕
        </button>
      )}
    </div>
  )
}
