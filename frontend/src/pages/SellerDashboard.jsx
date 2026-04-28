import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { sellerAPI } from '../services/api'
import { Loading, ErrorAlert } from '../components/Utils'

export default function SellerDashboard() {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)

      if (activeTab === 'overview') {
        const statsRes = await sellerAPI.getSellerStats()
        setStats(statsRes.data)
      } else if (activeTab === 'products') {
        const productsRes = await sellerAPI.getSellerProducts()
        setProducts(productsRes.data)
      } else if (activeTab === 'orders') {
        const ordersRes = await sellerAPI.getSellerOrders()
        setOrders(ordersRes.data)
      }

      setError('')
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.name}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4 border-b">
          {['overview', 'products', 'orders', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorAlert message={error} />}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium">Total Products</h3>
                <p className="text-4xl font-bold mt-2">{stats.totalProducts}</p>
              </div>
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
                <p className="text-4xl font-bold mt-2">{stats.totalOrders}</p>
              </div>
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium">Total Sales</h3>
                <p className="text-4xl font-bold mt-2 text-blue-600">${stats.totalSales?.toFixed(2)}</p>
              </div>
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium">Avg Rating</h3>
                <p className="text-4xl font-bold mt-2 text-yellow-500">{stats.averageRating?.toFixed(1)}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link to="/seller/products/new" className="card hover:shadow-lg cursor-pointer">
                <h3 className="text-lg font-bold mb-2">Add New Product</h3>
                <p className="text-gray-600">Create and list a new product</p>
              </Link>
              <Link to="/seller/orders" className="card hover:shadow-lg cursor-pointer">
                <h3 className="text-lg font-bold mb-2">Manage Orders</h3>
                <p className="text-gray-600">View and fulfill orders</p>
              </Link>
              <Link to="/seller/analytics" className="card hover:shadow-lg cursor-pointer">
                <h3 className="text-lg font-bold mb-2">View Analytics</h3>
                <p className="text-gray-600">Check sales and performance</p>
              </Link>
            </div>

            {/* Recent Orders */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders?.map(order => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{order.orderNumber}</td>
                        <td className="py-3 px-4">{order.user?.name}</td>
                        <td className="py-3 px-4 font-semibold">${order.totalAmount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded text-white text-sm ${
                            order.status === 'delivered' ? 'bg-green-500' :
                            order.status === 'shipped' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Products</h2>
              <Link to="/seller/products/new" className="btn-primary">
                Add Product
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Product Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 font-semibold">Stock</th>
                    <th className="text-left py-3 px-4 font-semibold">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{product.name}</td>
                      <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded text-sm ${
                          product.stock > 10 ? 'bg-green-100 text-green-800' :
                          product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">⭐ {product.rating?.toFixed(1) || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <Link to={`/seller/products/${product._id}/edit`} className="text-blue-600 hover:text-blue-800 mr-3">
                          Edit
                        </Link>
                        <button className="text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Orders for Fulfillment</h2>
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg">Order {order.orderNumber}</h3>
                      <p className="text-gray-600">Customer: {order.user?.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-white text-sm font-medium ${
                      order.status === 'delivered' ? 'bg-green-500' :
                      order.status === 'shipped' ? 'bg-blue-500' :
                      order.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mb-3">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        {item.product.name} x {item.quantity}
                      </p>
                    ))}
                  </div>
                  <Link to={`/seller/orders/${order._id}`} className="text-blue-600 hover:text-blue-800">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
            <p className="text-gray-600">Analytics dashboard coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
