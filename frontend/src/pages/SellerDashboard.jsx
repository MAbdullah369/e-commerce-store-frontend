import { useState, useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { sellerAPI } from '../services/api'
import { Loading } from '../components/Utils'
import { FiGrid, FiPackage, FiShoppingBag, FiBarChart2, FiPlus, FiEdit, FiTrash2, FiStar, FiTrendingUp, FiDollarSign, FiUsers, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiLoader, FiCheck, FiClock, FiX, FiTruck, FiImage } from 'react-icons/fi'

export default function SellerDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('overview')
  const [shop, setShop] = useState(null)
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [shopForm, setShopForm] = useState({ shopName: '', shopDescription: '' })

  if (authLoading) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'seller') return <Navigate to="/" replace />

  useEffect(() => { fetchShop(); fetchStats() }, [])

  const fetchShop = async () => { try { const res = await sellerAPI.getMyShop(); setShop(res.data); setShopForm({ shopName: res.data?.shopName || '', shopDescription: res.data?.shopDescription || '' }) } catch {} }
  const fetchStats = async () => { try { const res = await sellerAPI.getSellerStats(); setStats(res.data) } catch {} }
  const fetchProducts = async () => { setLoading(true); try { const res = await sellerAPI.getSellerProducts(); setProducts(res.data.products || res.data || []) } catch { setError('Failed to load products') } finally { setLoading(false) } }
  const fetchOrders = async () => { setLoading(true); try { const res = await sellerAPI.getSellerOrders(); setOrders(res.data.orders || res.data || []) } catch { setError('Failed to load orders') } finally { setLoading(false) } }

  const handleTabChange = (tab) => { setActiveTab(tab); setError(''); setSuccess(''); if (tab === 'products') fetchProducts(); else if (tab === 'orders') fetchOrders(); else if (tab === 'overview') fetchStats() }

  const handleCreateShop = async () => { if (!shopForm.shopName) { setError('Shop name required'); return }; setLoading(true); try { const res = await sellerAPI.createShop(shopForm); setShop(res.data); setSuccess('Shop created!') } catch (err) { setError(err.response?.data?.error || 'Failed') } finally { setLoading(false) } }
  const handleDeleteProduct = async (id) => { if (!window.confirm('Delete?')) return; try { await sellerAPI.deleteProduct(id); fetchProducts() } catch { setError('Failed to delete') } }
  const handlePublish = async (id) => { try { await sellerAPI.publishProduct(id); fetchProducts(); setSuccess('Product published!') } catch (err) { setError(err.response?.data?.error || 'Failed') } }
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const { orderAPI } = await import('../services/api')
      if (status === 'shipped') {
        await orderAPI.shipOrder(orderId)
      } else {
        await orderAPI.updateOrderStatus(orderId, status)
      }
      fetchOrders()
      setSuccess(`Order marked as ${status}!`)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update order')
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'products', label: 'Products', icon: FiPackage },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
  ]

  const statusConfig = { pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', icon: FiClock }, processing: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: FiPackage }, shipped: { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: FiTruck }, delivered: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FiCheck }, cancelled: { color: 'bg-red-50 text-red-700 border-red-200', icon: FiX } }

  // No shop yet
  if (!shop) return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16">
      <div className="max-w-md mx-auto px-4 animate-fade-in-up">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"><FiShoppingBag className="w-9 h-9 text-white" /></div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Create Your Shop</h2>
          <p className="text-gray-500 mb-6 text-sm">Set up your seller profile to start selling</p>
          {error && <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-3 mb-4 text-sm text-red-700"><FiAlertCircle className="w-4 h-4" /> {error}</div>}
          <div className="space-y-4 text-left">
            <div><label className="label">Shop Name *</label><input type="text" className="input-field" value={shopForm.shopName} onChange={e => setShopForm(p => ({ ...p, shopName: e.target.value }))} placeholder="My Amazing Shop" /></div>
            <div><label className="label">Description</label><textarea className="input-field" rows={3} value={shopForm.shopDescription} onChange={e => setShopForm(p => ({ ...p, shopDescription: e.target.value }))} placeholder="Tell customers about your shop..." /></div>
            <button onClick={handleCreateShop} disabled={loading} className="w-full btn-secondary py-3 flex items-center justify-center gap-2">{loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiPlus className="w-4 h-4" />} Create Shop</button>
          </div>
        </div>
      </div>
    </div>
  )

  const statCards = stats ? [
    { label: 'Total Products', value: stats.totalProducts || 0, icon: FiPackage, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Published', value: stats.publishedProducts || 0, icon: FiEye, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: FiShoppingBag, gradient: 'from-violet-500 to-purple-500' },
    { label: 'Revenue', value: `$${(stats.totalRevenue || 0).toFixed(2)}`, icon: FiDollarSign, gradient: 'from-amber-500 to-orange-500' },
  ] : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20"><FiShoppingBag className="w-5 h-5 text-white" /></div>
                {shop.shopName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${shop.shopStatus === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${shop.shopStatus === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {shop.shopStatus}
                </span>
              </div>
            </div>
            <Link to="/seller/products/new" className="btn-secondary text-sm py-2.5 flex items-center gap-2"><FiPlus className="w-4 h-4" /> New Product</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiAlertCircle className="w-5 h-5 text-red-500" /><span className="text-sm text-red-700">{error}</span></div>}
        {success && <div className="flex items-center gap-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiCheckCircle className="w-5 h-5 text-emerald-500" /><span className="text-sm text-emerald-700">{success}</span></div>}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => handleTabChange(id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === id ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {loading && <div className="flex justify-center py-12"><div className="relative"><div className="w-10 h-10 border-3 border-gray-200 rounded-full" /><div className="absolute top-0 left-0 w-10 h-10 border-3 border-primary-600 rounded-full animate-spin border-t-transparent" /></div></div>}

        {/* Overview */}
        {activeTab === 'overview' && !loading && (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map(({ label, value, icon: Icon, gradient }) => (
                <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />
                  <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}><Icon className="w-5 h-5 text-white" /></div>
                  <p className="text-gray-500 text-sm font-medium">{label}</p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && !loading && (
          <div className="animate-fade-in-up">
            {products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No products yet</p>
                <Link to="/seller/products/new" className="btn-primary inline-flex items-center gap-2"><FiPlus className="w-4 h-4" /> Add Product</Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b border-gray-100">
                      <tr>
                        {['Product', 'Price', 'Stock', 'Status', 'Actions'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map(p => (
                        <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">{p.image ? <img src={p.image} alt="" className="w-full h-full object-cover" /> : <FiImage className="w-4 h-4 text-gray-300" />}</div>
                              <div><p className="font-semibold text-gray-900 text-sm">{p.name}</p><p className="text-xs text-gray-400">{p.category}</p></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-primary-600 text-sm">${p.price?.toFixed(2)}</td>
                          <td className="px-6 py-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.stock > 10 ? 'bg-emerald-50 text-emerald-700' : p.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{p.stock}</span></td>
                          <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${p.isPublished ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>{p.isPublished ? <><FiEye className="w-3 h-3" /> Live</> : <><FiEyeOff className="w-3 h-3" /> Draft</>}</span></td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {!p.isPublished && <button onClick={() => handlePublish(p._id)} className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-lg hover:bg-emerald-100 transition-all"><FiEye className="w-3 h-3" /> Publish</button>}
                              <button onClick={() => handleDeleteProduct(p._id)} className="text-xs font-medium text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 transition-all"><FiTrash2 className="w-3 h-3" /> Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && !loading && (
          <div className="animate-fade-in-up">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <FiShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => {
                  const sc = statusConfig[order.status] || statusConfig.pending
                  const StatusIcon = sc.icon
                  return (
                    <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group relative">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <Link to={`/orders/${order._id}`} className="flex-1">
                          <p className="font-bold text-gray-900 text-sm group-hover:text-primary-600 transition-colors flex items-center gap-2">
                            Order #{order._id.slice(-8).toUpperCase()}
                            <FiEye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <p className="text-xs text-gray-400 mt-1">{order.items?.length || 0} item(s) · Buyer: {order.user?.name || 'N/A'}</p>
                        </Link>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${sc.color}`}><StatusIcon className="w-3 h-3" /> {order.status}</span>
                          <span className="text-lg font-extrabold text-gray-900">${(order.sellerSubtotal || order.totalAmount)?.toFixed(2)}</span>
                          {order.status === 'pending' && (
                            <button onClick={() => handleUpdateOrderStatus(order._id, 'processing')} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition-all">Process</button>
                          )}
                          {(order.status === 'processing' || order.status === 'confirmed') && (
                            <button onClick={() => handleUpdateOrderStatus(order._id, 'shipped')} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-100 transition-all">Ship</button>
                          )}
                          <Link to={`/orders/${order._id}`} className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-100 transition-all flex items-center gap-1.5"><FiEye className="w-3 h-3" /> Detail</Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}