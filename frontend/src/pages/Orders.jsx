import { useState, useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { orderAPI } from '../services/api'
import { Loading } from '../components/Utils'
import { FiPackage, FiTruck, FiCheck, FiX, FiClock, FiEye, FiShoppingBag, FiAlertCircle } from 'react-icons/fi'

export default function Orders() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { if (user) fetchOrders() }, [user])

  const fetchOrders = async () => {
    try { setLoading(true); const res = await orderAPI.getBuyerOrders(); setOrders(res.data.orders || res.data || []); setError('') }
    catch { setError('Failed to load orders') }
    finally { setLoading(false) }
  }

  if (authLoading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  if (loading) return <Loading />

  const statusConfig = {
    pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: FiClock, dot: 'bg-amber-500' },
    processing: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: FiPackage, dot: 'bg-blue-500' },
    shipped: { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: FiTruck, dot: 'bg-indigo-500' },
    delivered: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FiCheck, dot: 'bg-emerald-500' },
    cancelled: { color: 'bg-red-50 text-red-700 border-red-200', icon: FiX, dot: 'bg-red-500' },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20"><FiPackage className="w-5 h-5 text-white" /></div>
          My Orders
        </h1>

        {error && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" /><span className="text-sm text-red-700">{error}</span></div>}

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 animate-fade-in-up">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-5"><FiShoppingBag className="w-10 h-10 text-primary-500" /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link to="/products" className="btn-primary px-8 py-3 inline-flex items-center gap-2">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
            {orders.map(order => {
              const sc = statusConfig[order.status] || statusConfig.pending
              const StatusIcon = sc.icon
              return (
                <Link key={order._id} to={`/orders/${order._id}`} className="block bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200/50 transition-all duration-300 p-6 group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 ${sc.color} border rounded-xl flex items-center justify-center flex-shrink-0`}><StatusIcon className="w-5 h-5" /></div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-xs text-gray-400 mt-1">{order.items?.length || 0} item(s)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${sc.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                      <span className="text-lg font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">${order.totalAmount?.toFixed(2)}</span>
                      <FiEye className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    </div>
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