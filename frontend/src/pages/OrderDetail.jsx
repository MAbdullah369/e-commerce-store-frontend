import { useEffect, useState, useContext } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { orderAPI, paymentAPI } from '../services/api'
import { AuthContext } from '../context/AuthContext'

export default function OrderDetail() {
  const { id } = useParams()
  const { user, loading: authLoading } = useContext(AuthContext)
  const [order, setOrder] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) fetchOrderDetails()
  }, [id, user])

  if (authLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const orderRes = await orderAPI.getOrderById(id)
      setOrder(orderRes.data)
      try {
        const paymentsRes = await paymentAPI.getOrderPayments(id)
        setPayments(paymentsRes.data || [])
      } catch (_) {
        // payments optional
      }
      setError('')
    } catch (err) {
      setError('Failed to load order details')
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading order...</div>

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-red-500">{error || 'Order not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Order Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4 pb-4 border-b">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order {order.orderNumber}</h2>
                  <p className="text-gray-500 text-sm mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Shipping */}
              <div className="mb-5">
                <h3 className="font-semibold text-gray-700 mb-2">Shipping Address</h3>
                <div className="text-gray-600 text-sm leading-relaxed">
                  <p>{order.shippingAddress?.street}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                  <p>{order.shippingAddress?.country}</p>
                  {order.shippingAddress?.phone && <p className="mt-1">📞 {order.shippingAddress.phone}</p>}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-5">
                <h3 className="font-semibold text-gray-700 mb-1">Payment Method</h3>
                <p className="text-gray-600 text-sm">{order.paymentMethod?.replace(/_/g, ' ').toUpperCase()}</p>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Items</h3>
                <div className="space-y-3">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium text-gray-900">{item.product?.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${item.price?.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Subtotal: ${item.subtotal?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payments */}
            {payments.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Payment History</h2>
                <div className="space-y-3">
                  {payments.map((payment, idx) => (
                    <div key={idx} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                      <div>
                        <p className="font-semibold text-gray-900">${payment.amount?.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {payment.status?.charAt(0).toUpperCase() + payment.status?.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Order Total</h2>
              <div className="space-y-2 mb-5 pb-5 border-b text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${order.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${order.totalAmount?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}