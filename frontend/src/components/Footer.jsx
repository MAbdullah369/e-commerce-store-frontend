import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-white font-bold text-xl">E-Store</span>
            <p className="text-sm mt-1">Quality products at great prices.</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/products" className="hover:text-white transition">Products</Link>
            <Link to="/login" className="hover:text-white transition">Login</Link>
            <Link to="/register" className="hover:text-white transition">Sign Up</Link>
          </div>
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} E-Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}