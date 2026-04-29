import { useEffect, useState, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { orderAPI } from '../services/api'
import { AuthContext } from '../context/AuthContext'

export default function Orders() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) fetchOrders()
  }, [user])

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderAPI.getBuyerOrders()
      setOrders(response.data || [])
      setError('')
    } catch (err) {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const statusColor = (status) => {
    if (status === 'delivered') return 'bg-green-100 text-green-700'
    if (status === 'shipped') return 'bg-blue-100 text-blue-700'
    if (status === 'cancelled') return 'bg-red-100 text-red-700'
    return 'bg-yellow-100 text-yellow-700'
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading orders...</div>

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">My Orders</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border shadow-sm">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet</p>
            <Link to="/products" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Order {order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">${order.totalAmount.toFixed(2)}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${statusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4 pb-4 border-b">
                  {(order.items || []).map((item, idx) => (
                    <span key={idx}>
                      {item.product?.name} ×{item.quantity}{idx < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Link to={`/orders/${order._id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    View Details
                  </Link>
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}