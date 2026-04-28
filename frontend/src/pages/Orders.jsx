import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { orderAPI } from '../services/api'
import { Loading, ErrorAlert } from '../components/Utils'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderAPI.getBuyerOrders()
      setOrders(response.data)
      setError('')
    } catch (err) {
      setError('Failed to load orders')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {error && <ErrorAlert message={error} />}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">You haven't placed any orders yet</p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="card hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">Order {order.orderNumber}</h3>
                    <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">${order.totalAmount.toFixed(2)}</p>
                    <span className={`inline-block px-3 py-1 rounded text-white text-sm font-medium ${
                      order.status === 'delivered' ? 'bg-green-500' :
                      order.status === 'shipped' ? 'bg-blue-500' :
                      order.status === 'cancelled' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-gray-600 mb-2">{order.items.length} item(s)</p>
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      {item.product.name} x {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Link to={`/orders/${order._id}`} className="btn-primary">
                    View Details
                  </Link>
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <button className="btn-danger">
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
