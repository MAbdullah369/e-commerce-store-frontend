import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { orderAPI, paymentAPI } from '../services/api'
import { Loading, ErrorAlert } from '../components/Utils'

export default function OrderDetail() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrderDetails()
  }, [id])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      const orderRes = await orderAPI.getOrderById(id)
      setOrder(orderRes.data)

      const paymentsRes = await paymentAPI.getOrderPayments(id)
      setPayments(paymentsRes.data)
      
      setError('')
    } catch (err) {
      setError('Failed to load order details')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorAlert message={error} />
  if (!order) return <ErrorAlert message="Order not found" />

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Order Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Order Information */}
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-4">Order {order.orderNumber}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                <div>
                  <p className="text-gray-600 text-sm">Order Date</p>
                  <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
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

              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Shipping Address</h3>
                <div className="text-gray-600">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Payment Method</h3>
                <p className="text-gray-600">{order.paymentMethod?.replace(/_/g, ' ').toUpperCase()}</p>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-bold mb-4">Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between pb-4 border-b last:border-b-0">
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${item.price.toFixed(2)}</p>
                        <p className="text-gray-600">Subtotal: ${item.subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payments */}
            {payments.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold mb-4">Payments</h2>
                <div className="space-y-4">
                  {payments.map((payment, idx) => (
                    <div key={idx} className="pb-4 border-b last:border-b-0">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                          <p className="text-gray-600 text-sm">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded text-white text-sm font-medium ${
                          payment.status === 'completed' ? 'bg-green-500' :
                          payment.status === 'pending' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
