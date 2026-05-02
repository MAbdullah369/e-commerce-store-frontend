import { useState, useEffect } from 'react'
import { productAPI } from '../services/api'
import { Loading, ErrorAlert } from '../components/Utils'
import ProductCard from '../components/ProductCard'
import { FiSearch, FiFilter, FiSliders, FiX, FiChevronDown } from 'react-icons/fi'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'

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
      setProducts(response.data.products)
      setError('')
    } catch (err) { setError('Failed to load products'); console.error(err) }
    finally { setLoading(false) }
  }

  const fetchCategories = async () => {
    try { const response = await productAPI.getCategories(); setCategories(response.data) }
    catch (err) { console.error('Failed to load categories:', err) }
  }

  const handleFilterChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value, page: 1 }))
  const clearFilters = () => setFilters({ category: '', search: '', minPrice: '', maxPrice: '', sort: '', page: 1 })
  const hasActiveFilters = filters.category || filters.search || filters.minPrice || filters.maxPrice || filters.sort

  if (loading && products.length === 0) return <Loading />

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                <HiOutlineSquares2X2 className="w-5 h-5 text-white" />
              </div>
              Products
            </h1>
            <p className="text-gray-500 text-sm mt-1">Discover our curated collection</p>
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
            <FiSliders className="w-4 h-4" /> Filters
            {hasActiveFilters && <span className="w-2 h-2 bg-primary-500 rounded-full"></span>}
          </button>
        </div>

        {error && <ErrorAlert message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`md:col-span-1 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2"><FiFilter className="w-4 h-4 text-primary-500" /> Filters</h3>
                {hasActiveFilters && <button onClick={clearFilters} className="text-xs text-primary-600 font-semibold hover:text-primary-700 flex items-center gap-1"><FiX className="w-3 h-3" /> Clear</button>}
              </div>

              {/* Search */}
              <div className="mb-5">
                <label className="label">Search</label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" className="input-field pl-10 text-sm" placeholder="Search products..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
                </div>
              </div>

              {/* Category */}
              <div className="mb-5">
                <label className="label">Category</label>
                <div className="relative">
                  <select className="input-field text-sm appearance-none pr-10" value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-5 grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Min Price</label>
                  <input type="number" className="input-field text-sm" placeholder="$0" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} />
                </div>
                <div>
                  <label className="label">Max Price</label>
                  <input type="number" className="input-field text-sm" placeholder="$999" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-5">
                <label className="label">Sort By</label>
                <div className="relative">
                  <select className="input-field text-sm appearance-none pr-10" value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)}>
                    <option value="">Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <button onClick={clearFilters} className="w-full btn-outline text-sm">Clear All Filters</button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlineSquares2X2 className="w-10 h-10 text-gray-300" />
                </div>
                <p className="text-gray-500 text-lg font-medium">No products found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => <ProductCard key={product._id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
