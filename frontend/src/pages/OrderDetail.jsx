import { useState, useEffect, useContext } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { orderAPI } from '../services/api'
import { Loading } from '../components/Utils'
import { FiPackage, FiMapPin, FiCreditCard, FiCheck, FiTruck, FiClock, FiX, FiArrowLeft, FiImage, FiAlertCircle, FiLoader } from 'react-icons/fi'

export default function OrderDetail() {
  const { id } = useParams()
  const { user, loading: authLoading } = useContext(AuthContext)
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelLoading, setCancelLoading] = useState(false)

  useEffect(() => { if (user) fetchOrder() }, [id, user])

  const fetchOrder = async () => { try { setLoading(true); const res = await orderAPI.getOrderById(id); setOrder(res.data); setError('') } catch { setError('Failed to load order') } finally { setLoading(false) } }

  const handleCancel = async () => { if (!window.confirm('Cancel this order?')) return; setCancelLoading(true); try { await orderAPI.cancelOrder(id, 'Cancelled by user'); await fetchOrder() } catch (err) { setError(err.response?.data?.error || 'Failed to cancel') } finally { setCancelLoading(false) } }
  const handleReceive = async () => { if (!window.confirm('Mark this order as received?')) return; try { setLoading(true); await orderAPI.receiveOrder(id); await fetchOrder() } catch (err) { setError(err.response?.data?.error || 'Failed to update order') } finally { setLoading(false) } }
  const handleShip = async () => { if (!window.confirm('Mark this order as shipped?')) return; try { setLoading(true); await orderAPI.shipOrder(id); await fetchOrder() } catch (err) { setError(err.response?.data?.error || 'Failed to ship order') } finally { setLoading(false) } }

  if (authLoading || loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />

  if (error || !order) return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
      <div className="text-center animate-fade-in"><FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" /><p className="text-red-500 mb-4">{error || 'Order not found'}</p><Link to="/orders" className="btn-primary">Back to Orders</Link></div>
    </div>
  )

  const statusConfig = {
    pending: { color: 'border-amber-500 bg-amber-50 text-amber-700', icon: FiClock },
    processing: { color: 'border-blue-500 bg-blue-50 text-blue-700', icon: FiPackage },
    shipped: { color: 'border-indigo-500 bg-indigo-50 text-indigo-700', icon: FiTruck },
    delivered: { color: 'border-emerald-500 bg-emerald-50 text-emerald-700', icon: FiCheck },
    cancelled: { color: 'border-red-500 bg-red-50 text-red-700', icon: FiX },
  }
  const sc = statusConfig[order.status] || statusConfig.pending
  const StatusIcon = sc.icon
  const steps = ['pending', 'processing', 'shipped', 'delivered']
  const stepIndex = steps.indexOf(order.status)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 text-sm font-medium transition-colors animate-fade-in"><FiArrowLeft className="w-4 h-4" /> Back to Orders</Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
              <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${sc.color}`}><StatusIcon className="w-4 h-4" /> {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}</span>
              {(order.status === 'pending' || order.status === 'processing') && (user.role === 'buyer' || user.role === 'admin') && (
                <button onClick={handleCancel} disabled={cancelLoading} className="btn-danger text-xs py-2 px-4 flex items-center gap-1.5">{cancelLoading ? <FiLoader className="w-3 h-3 animate-spin" /> : <FiX className="w-3 h-3" />} Cancel</button>
              )}
              {order.status === 'shipped' && user.role === 'buyer' && (
                <button onClick={handleReceive} className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 border-emerald-600 shadow-emerald-500/20"><FiCheck className="w-3 h-3" /> Mark as Received</button>
              )}
              {(order.status === 'confirmed' || order.status === 'processing') && user.role === 'seller' && (
                <button onClick={handleShip} className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 border-indigo-600 shadow-indigo-500/20"><FiTruck className="w-3 h-3" /> Mark as Shipped</button>
              )}
            </div>
          </div>

          {/* Progress */}
          {order.status !== 'cancelled' && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"><div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500" style={{ width: `${stepIndex >= 0 ? (stepIndex / (steps.length - 1)) * 100 : 0}%` }}></div></div>
                {steps.map((step, i) => {
                  const completed = i <= stepIndex
                  const icons = { pending: FiClock, processing: FiPackage, shipped: FiTruck, delivered: FiCheck }
                  const StepIcon = icons[step]
                  return (
                    <div key={step} className="relative flex flex-col items-center z-10">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${completed ? 'bg-gradient-to-br from-primary-500 to-accent-600 text-white shadow-lg shadow-primary-500/20' : 'bg-gray-100 text-gray-400'}`}><StepIcon className="w-4 h-4" /></div>
                      <span className={`mt-2 text-xs font-medium capitalize ${completed ? 'text-primary-600' : 'text-gray-400'}`}>{step}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up delay-200">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900 flex items-center gap-2"><FiPackage className="w-4 h-4 text-primary-500" /> Order Items</h2></div>
              <div className="divide-y divide-gray-100">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 hover:bg-gray-50/50 transition-colors">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100">
                      {item.product?.image ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" /> : <FiImage className="w-5 h-5 text-gray-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{item.product?.name || 'Product'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                    </div>
                    <p className="font-bold text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiCreditCard className="w-4 h-4 text-primary-500" /> Summary</h3>
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span className="font-semibold text-gray-900">${order.totalAmount?.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span className="text-emerald-600 font-semibold">Free</span></div>
              </div>
              <div className="flex justify-between font-extrabold text-lg"><span>Total</span><span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">${order.totalAmount?.toFixed(2)}</span></div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiMapPin className="w-4 h-4 text-primary-500" /> Shipping</h3>
              {order.shippingAddress ? (
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : <p className="text-sm text-gray-400">No address provided</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}