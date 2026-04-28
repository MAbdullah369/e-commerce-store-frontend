import { useState, useEffect, useContext } from 'react'
import { productAPI } from '../services/api'
import { Loading, ErrorAlert } from '../components/Utils'
import ProductCard from '../components/ProductCard'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
    page: 1,
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productAPI.getAllProducts({
        category: filters.category || undefined,
        search: filters.search || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        sort: filters.sort || undefined,
        page: filters.page,
        limit: 12,
      })
      setProducts(response.data.products)
      setError('')
    } catch (err) {
      setError('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await productAPI.getCategories()
      setCategories(response.data)
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }))
  }

  if (loading && products.length === 0) return <Loading />

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Products</h1>

        {error && <ErrorAlert message={error} />}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Filters</h3>

              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Search</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  className="input-field"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Min Price</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Max Price</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>

              {/* Sort */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  className="input-field"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({
                  category: '',
                  search: '',
                  minPrice: '',
                  maxPrice: '',
                  sort: '',
                  page: 1,
                })}
                className="btn-outline w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
