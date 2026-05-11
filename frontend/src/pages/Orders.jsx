// Orders.jsx — Premium Redesign
import { useState, useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { orderAPI } from '../services/api'
import { Loading } from '../components/Utils'
import { FiPackage, FiTruck, FiCheck, FiX, FiClock, FiEye, FiShoppingBag, FiAlertCircle, FiArrowRight } from 'react-icons/fi'

export default function Orders() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { if (user) fetchOrders() }, [user])

  const fetchOrders = async () => {
    try { setLoading(true); const res = await orderAPI.getBuyerOrders(); setOrders(res.data.orders || res.data || []); setError('') }
    catch { setError('Failed to load orders') } finally { setLoading(false) }
  }

  const handleReceive = async (e, id) => {
    e.preventDefault()
    if (!window.confirm('Mark as received?')) return
    try { setLoading(true); await orderAPI.receiveOrder(id); await fetchOrders() }
    catch (err) { setError(err.response?.data?.error || 'Failed') } finally { setLoading(false) }
  }

  if (authLoading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'buyer') return <Navigate to="/" replace />
  if (loading) return <Loading />

  const statusMap = {
    pending: { label: 'Pending', icon: FiClock, class: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20', dot: 'bg-amber-500' },
    processing: { label: 'Processing', icon: FiPackage, class: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20', dot: 'bg-blue-500' },
    shipped: { label: 'Shipped', icon: FiTruck, class: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20', dot: 'bg-indigo-500' },
    delivered: { label: 'Delivered', icon: FiCheck, class: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20', dot: 'bg-emerald-500' },
    cancelled: { label: 'Cancelled', icon: FiX, class: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20', dot: 'bg-red-500' },
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
        <div className="mb-8">
          <p className="text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1">History</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">My Orders</h1>
        </div>

        {error && <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4 mb-6"><FiAlertCircle className="w-4 h-4 text-red-500" /><span className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</span></div>}

        {orders.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 dark:bg-white/2 rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <FiShoppingBag className="w-8 h-8 text-gray-300 dark:text-gray-700" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">No orders yet</h2>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Start shopping to see your orders here</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => {
              const sc = statusMap[order.status] || statusMap.pending
              const StatusIcon = sc.icon
              return (
                <Link key={order._id} to={`/orders/${order._id}`} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30 transition-all p-5 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${sc.class}`}>
                      <StatusIcon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 dark:text-white text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} · {order.items?.length || 0} item(s)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-14 sm:ml-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${sc.class}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />{sc.label}
                    </span>
                    <span className="text-base font-black text-gray-900 dark:text-white">${order.totalAmount?.toFixed(2)}</span>
                    <FiArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-700 group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all" />
                    {order.status === 'shipped' && (
                      <button onClick={(e) => handleReceive(e, order._id)} className="text-[11px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 rounded-xl font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/15 transition-all">
                        Mark Received
                      </button>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}