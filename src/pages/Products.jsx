// Products.jsx — Premium Redesign
import { useState, useEffect } from 'react'
import { productAPI } from '../services/api'
import { Loading, ErrorAlert } from '../components/Utils'
import ProductCard from '../components/ProductCard'
import { FiSearch, FiFilter, FiX, FiChevronDown, FiSliders, FiGrid, FiList } from 'react-icons/fi'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ category: '', search: '', minPrice: '', maxPrice: '', sort: '', page: 1 })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { fetchProducts(); fetchCategories() }, [filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAllProducts({ category: filters.category || undefined, search: filters.search || undefined, minPrice: filters.minPrice || undefined, maxPrice: filters.maxPrice || undefined, sort: filters.sort || undefined, page: filters.page, limit: 12 })
      setProducts(response.data.products); setError('')
    } catch { setError('Failed to load products') } finally { setLoading(false) }
  }

  const fetchCategories = async () => {
    try { const response = await productAPI.getCategories(); setCategories(response.data) } catch { }
  }

  const handleFilterChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value, page: 1 }))
  const clearFilters = () => setFilters({ category: '', search: '', minPrice: '', maxPrice: '', sort: '', page: 1 })
  const hasActiveFilters = filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.sort

  if (loading && products.length === 0) return <Loading />

  const inputClass = "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-[13px] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/8 transition-all"

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">Discover</p>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              All Products
            </h1>
            {!loading && <p className="text-gray-400 dark:text-gray-500 text-sm mt-1 font-medium">{products.length} items found</p>}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-[12px] font-semibold text-red-500 hover:text-red-700 border border-red-200 dark:border-red-500/30 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                <FiX className="w-3.5 h-3.5" /> Clear filters
              </button>
            )}
            <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-[13px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/8 transition-all">
              <FiSliders className="w-4 h-4" /> Filters
              {hasActiveFilters && <span className="w-2 h-2 bg-violet-600 rounded-full" />}
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`md:col-span-1 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white/80 dark:bg-[#0c0c14]/80 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-white/5 p-5 sticky top-24 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <FiFilter className="w-4 h-4 text-violet-500" /> Filters
                </h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline">Clear all</button>
                )}
              </div>

              <div className="space-y-5">
                {/* Search */}
                <div>
                  <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Search</label>
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input type="text" className={`${inputClass} pl-9`} placeholder="Search products..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Category</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none pr-9`} value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
                      <option value="">All Categories</option>
                      {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" className={inputClass} placeholder="Min $" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} />
                    <input type="number" className={inputClass} placeholder="Max $" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Sort By</label>
                  <div className="relative">
                    <select className={`${inputClass} appearance-none pr-9`} value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)}>
                      <option value="">Default</option>
                      <option value="price-asc">Price: Low → High</option>
                      <option value="price-desc">Price: High → Low</option>
                      <option value="newest">Newest First</option>
                      <option value="rating">Top Rated</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton rounded-2xl h-[340px] border border-gray-100 dark:border-white/5" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="relative text-center py-24 bg-gray-50/50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-[80px] pointer-events-none" />
                <div className="relative w-16 h-16 bg-white dark:bg-white/5 shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100 dark:border-white/10">
                  <FiGrid className="w-7 h-7 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="relative text-gray-900 dark:text-gray-100 font-bold mb-1 text-lg tracking-tight">No products found</p>
                <p className="relative text-gray-400 dark:text-gray-500 text-sm">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(product => <ProductCard key={product._id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}