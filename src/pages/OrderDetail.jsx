// OrderDetail.jsx — Premium Redesign
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

  const fetchOrder = async () => {
    try { setLoading(true); const res = await orderAPI.getOrderById(id); setOrder(res.data); setError('') }
    catch { setError('Failed to load order') } finally { setLoading(false) }
  }

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return
    setCancelLoading(true)
    try { await orderAPI.cancelOrder(id, 'Cancelled by user'); await fetchOrder() }
    catch (err) { setError(err.response?.data?.error || 'Failed to cancel') } finally { setCancelLoading(false) }
  }
  const handleReceive = async () => {
    if (!window.confirm('Mark as received?')) return
    try { setLoading(true); await orderAPI.receiveOrder(id); await fetchOrder() }
    catch (err) { setError(err.response?.data?.error || 'Failed') } finally { setLoading(false) }
  }
  const handleShip = async () => {
    if (!window.confirm('Mark as shipped?')) return
    try { setLoading(true); await orderAPI.shipOrder(id); await fetchOrder() }
    catch (err) { setError(err.response?.data?.error || 'Failed') } finally { setLoading(false) }
  }

  if (authLoading || loading) return <Loading />
  if (!user) return <Navigate to="/login" replace />

  if (error || !order) return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px] flex items-center justify-center">
      <div className="text-center">
        <FiAlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-red-500 dark:text-red-400 mb-4 font-medium">{error || 'Order not found'}</p>
        <Link to="/orders" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all">Back to Orders</Link>
      </div>
    </div>
  )

  const statusMap = {
    pending: { class: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20', icon: FiClock },
    processing: { class: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20', icon: FiPackage },
    shipped: { class: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20', icon: FiTruck },
    delivered: { class: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20', icon: FiCheck },
    cancelled: { class: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20', icon: FiX },
  }

  const sc = statusMap[order.status] || statusMap.pending
  const StatusIcon = sc.icon
  const steps = ['pending', 'processing', 'shipped', 'delivered']
  const stepIndex = steps.indexOf(order.status)
  const stepIcons = { pending: FiClock, processing: FiPackage, shipped: FiTruck, delivered: FiCheck }

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <Link to="/orders" className="inline-flex items-center gap-2 text-[13px] font-semibold text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 mb-6 transition-colors">
          <FiArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>

        {/* Header card */}
        <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Order</p>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">#{order._id.slice(-8).toUpperCase()}</h1>
              <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border ${sc.class}`}>
                <StatusIcon className="w-4 h-4" /> {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
              {(order.status === 'pending' || order.status === 'processing') && (user.role === 'buyer' || user.role === 'admin') && (
                <button onClick={handleCancel} disabled={cancelLoading} className="flex items-center gap-1.5 text-sm font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all disabled:opacity-60">
                  {cancelLoading ? <FiLoader className="w-3.5 h-3.5 animate-spin" /> : <FiX className="w-3.5 h-3.5" />} Cancel
                </button>
              )}
              {order.status === 'shipped' && user.role === 'buyer' && (
                <button onClick={handleReceive} className="flex items-center gap-1.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                  <FiCheck className="w-3.5 h-3.5" /> Mark Received
                </button>
              )}
              {(order.status === 'confirmed' || order.status === 'processing') && user.role === 'seller' && (
                <button onClick={handleShip} className="flex items-center gap-1.5 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 rounded-xl hover:shadow-lg transition-all">
                  <FiTruck className="w-3.5 h-3.5" /> Mark Shipped
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {order.status !== 'cancelled' && (
            <div className="relative flex items-center justify-between pt-2">
              <div className="absolute top-[18px] left-0 right-0 h-[2px] bg-gray-100 dark:bg-white/5">
                <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-700" style={{ width: `${stepIndex >= 0 ? (stepIndex / (steps.length - 1)) * 100 : 0}%` }} />
              </div>
              {steps.map((step, i) => {
                const completed = i <= stepIndex
                const StepIcon = stepIcons[step]
                return (
                  <div key={step} className="relative flex flex-col items-center z-10 gap-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${completed ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25' : 'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-700'}`}>
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <span className={`text-[11px] font-bold capitalize ${completed ? 'text-violet-600 dark:text-violet-400' : 'text-gray-300 dark:text-gray-700'}`}>{step}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 dark:border-white/5">
                <h2 className="font-black text-gray-900 dark:text-white text-sm flex items-center gap-2">
                  <FiPackage className="w-4 h-4 text-violet-500" /> Order Items
                </h2>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                    <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/5">
                      {item.product?.image ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" /> : <FiImage className="w-5 h-5 text-gray-300 dark:text-gray-700" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{item.product?.name || 'Product'}</p>
                      <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                    </div>
                    <p className="font-black text-gray-900 dark:text-white text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary + Shipping */}
          <div className="space-y-5">
            <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-5">
              <h3 className="font-black text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2"><FiCreditCard className="w-4 h-4 text-violet-500" /> Summary</h3>
              <div className="space-y-2 pb-4 border-b border-gray-100 dark:border-white/5 mb-4">
                <div className="flex justify-between text-[13px]"><span className="text-gray-400 dark:text-gray-500">Subtotal</span><span className="font-bold text-gray-900 dark:text-white">${order.totalAmount?.toFixed(2)}</span></div>
                <div className="flex justify-between text-[13px]"><span className="text-gray-400 dark:text-gray-500">Shipping</span><span className="font-bold text-emerald-600 dark:text-emerald-400">Free</span></div>
              </div>
              <div className="flex justify-between font-black"><span className="text-gray-900 dark:text-white">Total</span><span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 text-lg">${order.totalAmount?.toFixed(2)}</span></div>
            </div>

            <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-5">
              <h3 className="font-black text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2"><FiMapPin className="w-4 h-4 text-violet-500" /> Delivery Address</h3>
              {order.shippingAddress ? (
                <div className="text-[13px] text-gray-500 dark:text-gray-400 space-y-1 leading-relaxed">
                  <p className="font-medium text-gray-700 dark:text-gray-300">{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : <p className="text-[13px] text-gray-400">No address provided</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}