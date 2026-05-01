import { useState, useEffect, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API from '../services/api'

export default function AdminDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState(null)
  const [users, setUsers] = useState([])
  const [sellers, setSellers] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: '' })

  // Auth guard — only admins allowed
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await API.get('/admin/dashboard')
      setDashboardData(response.data.stats)
      setError(null)
    } catch (err) {
      setError('Failed to fetch dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchActiveUsers = async () => {
    try {
      setLoading(true)
      const response = await API.get('/admin/users/active')
      setUsers(response.data.users || response.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const fetchSellers = async () => {
    try {
      setLoading(true)
      const response = await API.get('/admin/sellers')
      setSellers(response.data.sellers || response.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch sellers')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await API.get('/admin/categories')
      setCategories(response.data.categories || response.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await API.get('/admin/products')
      setProducts(response.data.products || response.data || [])
      setError(null)
    } catch (err) {
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'users') fetchActiveUsers()
    else if (tab === 'sellers') fetchSellers()
    else if (tab === 'categories') fetchCategories()
    else if (tab === 'products') fetchProducts()
    else if (tab === 'dashboard') fetchDashboardData()
  }

  const handleApproveSeller = async (shopId) => {
    try {
      await API.patch(`/admin/sellers/${shopId}/approve`)
      alert('Seller approved successfully')
      fetchSellers()
    } catch (err) {
      alert('Failed to approve seller')
    }
  }

  const handleSuspendSeller = async (shopId) => {
    try {
      await API.patch(`/admin/sellers/${shopId}/suspend`)
      alert('Seller suspended successfully')
      fetchSellers()
    } catch (err) {
      alert('Failed to suspend seller')
    }
  }

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm('Deactivate this user?')) return
    try {
      await API.patch(`/admin/users/${userId}/deactivate`)
      alert('User deactivated successfully')
      fetchActiveUsers()
    } catch (err) {
      alert('Failed to deactivate user')
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      await API.post('/admin/categories', newCategory)
      alert('Category added successfully')
      setNewCategory({ name: '', description: '', image: '' })
      setShowAddCategory(false)
      fetchCategories()
    } catch (err) {
      alert('Failed to add category')
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await API.delete(`/admin/categories/${categoryId}`)
      alert('Category deleted')
      fetchCategories()
    } catch (err) {
      alert('Failed to delete category')
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await API.delete(`/admin/products/${productId}`)
      alert('Product deleted')
      fetchProducts()
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  const TAB_LABELS = {
    dashboard: '📊 Dashboard',
    users: '👥 Users',
    sellers: '🏪 Sellers',
    categories: '📂 Categories',
    products: '📦 Products',
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Logged in as <span className="font-semibold text-purple-600">{user.name}</span></p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 bg-white rounded-xl p-1 shadow-sm border w-fit">
          {Object.entries(TAB_LABELS).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        )}

        {/* ── DASHBOARD TAB ── */}
        {activeTab === 'dashboard' && !loading && (
          <div>
            {dashboardData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Total Users', value: dashboardData.totalUsers, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Active Sellers', value: dashboardData.activeSellers, color: 'text-green-600', bg: 'bg-green-50' },
                  { label: 'Total Categories', value: dashboardData.totalCategories, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { label: 'Total Products', value: dashboardData.totalProducts, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'Total Orders', value: dashboardData.totalOrders, color: 'text-red-600', bg: 'bg-red-50' },
                  { label: 'Total Revenue', value: `$${dashboardData.totalRevenue?.toFixed(2) || '0.00'}`, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-6 border`}>
                    <p className="text-gray-500 text-sm font-medium">{label}</p>
                    <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p className="text-5xl mb-4">📊</p>
                <p>No dashboard data available</p>
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && !loading && (
          <div className="bg-white rounded-xl shadow overflow-hidden border">
            {users.length === 0 ? (
              <p className="text-center py-12 text-gray-400">No active users found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                        <td className="px-6 py-4 text-gray-600">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full capitalize text-xs font-semibold ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                            u.role === 'seller' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.isActive && u.role !== 'admin' && (
                            <button
                              onClick={() => handleDeactivateUser(u._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs font-medium"
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── SELLERS TAB ── */}
        {activeTab === 'sellers' && !loading && (
          <div className="bg-white rounded-xl shadow overflow-hidden border">
            {sellers.length === 0 ? (
              <p className="text-center py-12 text-gray-400">No sellers found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {['Shop Name', 'Seller', 'Email', 'Status', 'Published Products', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sellers.map((shop) => (
                      <tr key={shop._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">{shop.shopName}</td>
                        <td className="px-6 py-4 text-gray-700">{shop.seller?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-500">{shop.seller?.email || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full capitalize text-xs font-semibold ${
                            shop.shopStatus === 'active' ? 'bg-green-100 text-green-800' :
                            shop.shopStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {shop.shopStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">{shop.publishedProducts || 0}</td>
                        <td className="px-6 py-4 flex gap-2">
                          {shop.shopStatus !== 'active' && (
                            <button
                              onClick={() => handleApproveSeller(shop._id)}
                              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs font-medium"
                            >
                              Approve
                            </button>
                          )}
                          {shop.shopStatus === 'active' && (
                            <button
                              onClick={() => handleSuspendSeller(shop._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs font-medium"
                            >
                              Suspend
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── CATEGORIES TAB ── */}
        {activeTab === 'categories' && !loading && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
              >
                {showAddCategory ? '✕ Cancel' : '+ Add New Category'}
              </button>
            </div>

            {showAddCategory && (
              <div className="bg-white p-6 rounded-xl shadow border mb-6">
                <h3 className="text-xl font-bold mb-4">Add New Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="2"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                    <input
                      type="url"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newCategory.image}
                      onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm">
                    Create Category
                  </button>
                </form>
              </div>
            )}

            {categories.length === 0 ? (
              <p className="text-center py-12 text-gray-400">No categories found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category._id} className="bg-white p-6 rounded-xl shadow border">
                    {category.image && (
                      <img src={category.image} alt={category.name} className="w-full h-36 object-cover rounded-lg mb-4" />
                    )}
                    <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">{category.description}</p>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === 'products' && !loading && (
          <div className="bg-white rounded-xl shadow overflow-hidden border">
            {products.length === 0 ? (
              <p className="text-center py-12 text-gray-400">No products found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {['Product', 'Seller', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 text-gray-600">{product.seller?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-gray-500">{product.category}</td>
                        <td className="px-6 py-4 font-medium">${product.price?.toFixed(2)}</td>
                        <td className="px-6 py-4">{product.stock}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            product.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}