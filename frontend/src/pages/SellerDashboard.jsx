import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { sellerAPI } from '../services/api'

export default function SellerDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [shop, setShop] = useState(null)
  const [shopNotFound, setShopNotFound] = useState(false)
  const [showCreateShop, setShowCreateShop] = useState(false)
  const [shopForm, setShopForm] = useState({
    shopName: '',
    description: '',
    logo: '',
    address: { street: '', city: '', state: '', zipCode: '', country: '' },
  })
  const [shopLoading, setShopLoading] = useState(false)

  // Auth guard — only sellers allowed
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'seller') return <Navigate to="/" replace />

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    fetchShopAndData()
  }, [activeTab])

  const fetchShopAndData = async () => {
    try {
      setLoading(true)
      setShopNotFound(false)
      const shopRes = await sellerAPI.getMyShop()
      setShop(shopRes.data)

      if (shopRes.data && shopRes.data.shopStatus === 'active') {
        if (activeTab === 'overview') {
          const statsRes = await sellerAPI.getSellerStats()
          setStats(statsRes.data)
        } else if (activeTab === 'products') {
          const productsRes = await sellerAPI.getSellerProducts()
          setProducts(productsRes.data || [])
        } else if (activeTab === 'orders') {
          const ordersRes = await sellerAPI.getSellerOrders()
          setOrders(ordersRes.data || [])
        }
      } else if (shopRes.data && shopRes.data.shopStatus === 'pending') {
        // Load products to show progress
        try {
          const productsRes = await sellerAPI.getSellerProducts()
          setProducts(productsRes.data || [])
        } catch (_) {}
      }
      setError('')
    } catch (err) {
      if (err.response?.status === 404) {
        setShop(null)
        setShopNotFound(true)
      } else {
        setError('Failed to load data. Please refresh.')
        console.error(err)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateShop = async (e) => {
    e.preventDefault()
    setShopLoading(true)
    try {
      const response = await sellerAPI.createShop(shopForm)
      setShop(response.data)
      setShopNotFound(false)
      setShowCreateShop(false)
      alert('Shop created! Now publish at least 3 products to activate it.')
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create shop')
    } finally {
      setShopLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await sellerAPI.deleteProduct(productId)
      fetchShopAndData()
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-lg">Loading...</div>
      </div>
    )
  }

  // ── Step 1: No shop yet — prompt to create ──
  if (shopNotFound || (!shop && !loading)) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🏪</div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
              <p className="text-gray-500 mt-2">You need to create your shop before you can start selling.</p>
            </div>

            {!showCreateShop ? (
              <div className="text-center">
                <button onClick={() => setShowCreateShop(true)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                  Create Your Shop
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateShop} className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Shop Details</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name *</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={shopForm.shopName}
                    onChange={(e) => setShopForm({ ...shopForm, shopName: e.target.value })}
                    required
                    placeholder="My Awesome Shop"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    value={shopForm.description}
                    onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                    required
                    placeholder="Tell buyers about your shop..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (optional)</label>
                  <input
                    type="url"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={shopForm.logo}
                    onChange={(e) => setShopForm({ ...shopForm, logo: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={shopForm.address.city}
                      onChange={(e) => setShopForm({ ...shopForm, address: { ...shopForm.address, city: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={shopForm.address.country}
                      onChange={(e) => setShopForm({ ...shopForm, address: { ...shopForm.address, country: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={shopLoading} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60">
                    {shopLoading ? 'Creating...' : 'Create Shop'}
                  </button>
                  <button type="button" onClick={() => setShowCreateShop(false)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Step 2: Shop exists but pending — needs 3 products ──
  if (shop && shop.shopStatus === 'pending') {
    const published = products.filter(p => p.isPublished).length
    const needed = Math.max(0, 3 - published)

    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">⏳</div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Shop Setup</h1>
              <p className="text-gray-500 mt-2">"{shop.shopName}" is pending activation.</p>
            </div>

            {/* Progress */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-3">
                <p className="font-semibold text-amber-900">Published Products</p>
                <span className="text-2xl font-bold text-amber-700">{published} / 3</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-3">
                <div
                  className="bg-amber-500 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (published / 3) * 100)}%` }}
                />
              </div>
              {needed > 0 && (
                <p className="text-sm text-amber-700 mt-2">
                  Publish {needed} more product{needed > 1 ? 's' : ''} to activate your shop
                </p>
              )}
            </div>

            {products.length > 0 && (
              <div className="mb-6">
                <p className="font-medium text-gray-700 mb-3">Your products:</p>
                <div className="space-y-2">
                  {products.map(p => (
                    <div key={p._id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <span className="text-gray-700">{p.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.isPublished ? '✓ Published' : 'Draft'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link
              to="/seller/products/new"
              className="block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              + Add New Product
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Step 3: Active shop — full dashboard ──
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
              <p className="text-gray-500 mt-1">
                {shop?.shopName} •{' '}
                <span className="text-green-600 font-medium">● Active</span>
              </p>
            </div>
            <Link to="/seller/products/new" className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition text-sm">
              + Add Product
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 border-b">
            {['overview', 'products', 'orders', 'analytics'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Products', value: stats.totalProducts || 0, color: 'text-blue-600' },
                { label: 'Total Orders', value: stats.totalOrders || 0, color: 'text-purple-600' },
                { label: 'Total Sales', value: `$${stats.totalSales?.toFixed(2) || '0.00'}`, color: 'text-green-600' },
                { label: 'Avg Rating', value: stats.averageRating?.toFixed(1) || 'N/A', color: 'text-yellow-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white rounded-xl p-6 shadow-sm border">
                  <p className="text-sm text-gray-500 font-medium">{label}</p>
                  <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {stats.recentOrders && stats.recentOrders.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-gray-500">
                        <th className="text-left py-2 px-3 font-medium">Order</th>
                        <th className="text-left py-2 px-3 font-medium">Customer</th>
                        <th className="text-left py-2 px-3 font-medium">Amount</th>
                        <th className="text-left py-2 px-3 font-medium">Status</th>
                        <th className="text-left py-2 px-3 font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.map(order => (
                        <tr key={order._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-3 font-medium">{order.orderNumber}</td>
                          <td className="py-3 px-3">{order.user?.name}</td>
                          <td className="py-3 px-3 font-semibold">${order.totalAmount.toFixed(2)}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">My Products</h2>
              <Link to="/seller/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                + Add Product
              </Link>
            </div>
            {products.length === 0 ? (
              <p className="text-center py-12 text-gray-400">No products yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {['Product', 'Price', 'Stock', 'Status', 'Rating', 'Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(product => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{product.name}</td>
                        <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 10 ? 'bg-green-100 text-green-700' :
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {product.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-yellow-500">⭐ {product.rating?.toFixed(1) || 'N/A'}</td>
                        <td className="py-3 px-4 flex gap-3">
                          <Link to={`/seller/products/${product._id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
                          <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center text-gray-400 border">No orders yet.</div>
            ) : (
              orders.map(order => (
                <div key={order._id} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">Order {order.orderNumber}</h3>
                      <p className="text-gray-500 text-sm">Customer: {order.user?.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {order.items?.map((item, idx) => (
                      <span key={idx}>{item.product?.name} x{item.quantity}{idx < order.items.length - 1 ? ', ' : ''}</span>
                    ))}
                  </div>
                  <Link to={`/seller/orders/${order._id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details →
                  </Link>
                </div>
              ))
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-400">
            <div className="text-5xl mb-4">📈</div>
            <p className="text-lg font-medium">Analytics dashboard coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}