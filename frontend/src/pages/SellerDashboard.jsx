// SellerDashboard.jsx — Premium Redesign
import { useState, useEffect, useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { sellerAPI } from '../services/api'
import { Loading, ScrollableTabs } from '../components/Utils'
import { FiGrid, FiPackage, FiShoppingBag, FiPlus, FiEdit, FiTrash2, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle, FiLoader, FiCheck, FiClock, FiX, FiTruck, FiImage, FiDollarSign, FiTrendingUp } from 'react-icons/fi'

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

  const fetchShop = async () => { try { const res = await sellerAPI.getMyShop(); setShop(res.data); setShopForm({ shopName: res.data?.shopName || '', shopDescription: res.data?.shopDescription || '' }) } catch { } }
  const fetchStats = async () => { try { const res = await sellerAPI.getSellerStats(); setStats(res.data) } catch { } }
  const fetchProducts = async () => { setLoading(true); try { const res = await sellerAPI.getSellerProducts(); setProducts(res.data.products || res.data || []) } catch { setError('Failed to load products') } finally { setLoading(false) } }
  const fetchOrders = async () => { setLoading(true); try { const res = await sellerAPI.getSellerOrders(); setOrders(res.data.orders || res.data || []) } catch { setError('Failed to load orders') } finally { setLoading(false) } }

  const handleTabChange = (tab) => { setActiveTab(tab); setError(''); setSuccess(''); if (tab === 'products') fetchProducts(); else if (tab === 'orders') fetchOrders(); else fetchStats() }
  const handleCreateShop = async () => { if (!shopForm.shopName) { setError('Shop name required'); return }; setLoading(true); try { const res = await sellerAPI.createShop(shopForm); setShop(res.data); setSuccess('Shop created!') } catch (err) { setError(err.response?.data?.error || 'Failed') } finally { setLoading(false) } }
  const handleDeleteProduct = async (id) => { if (!window.confirm('Delete?')) return; try { await sellerAPI.deleteProduct(id); fetchProducts() } catch { setError('Failed') } }
  const handlePublish = async (id) => { try { await sellerAPI.publishProduct(id); fetchProducts(); setSuccess('Published!') } catch (err) { setError(err.response?.data?.error || 'Failed') } }
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const { orderAPI } = await import('../services/api')
      if (status === 'shipped') await orderAPI.shipOrder(orderId)
      else await orderAPI.updateOrderStatus(orderId, status)
      fetchOrders(); setSuccess(`Order marked as ${status}!`)
    } catch (err) { setError(err.response?.data?.error || 'Failed') }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiGrid },
    { id: 'products', label: 'Products', icon: FiPackage },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
  ]

  const statusMap = {
    pending: { class: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20', icon: FiClock },
    processing: { class: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20', icon: FiPackage },
    shipped: { class: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20', icon: FiTruck },
    delivered: { class: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20', icon: FiCheck },
    cancelled: { class: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20', icon: FiX },
  }

  const inputClass = "w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/8 transition-all"

  // No shop
  if (!shop) return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px] py-16 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-emerald-500/25">
            <FiShoppingBag className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Create Your Shop</h2>
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">Set up your seller profile to start selling on LuxeStore</p>
          {error && <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl p-3 mb-4 text-sm text-red-700 dark:text-red-400 font-medium"><FiAlertCircle className="w-4 h-4 flex-shrink-0" /> {error}</div>}
          <div className="space-y-3 text-left">
            <div><label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Shop Name *</label><input type="text" className={inputClass} value={shopForm.shopName} onChange={e => setShopForm(p => ({ ...p, shopName: e.target.value }))} placeholder="My Amazing Shop" /></div>
            <div><label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Description</label><textarea className={`${inputClass} resize-none`} rows={3} value={shopForm.shopDescription} onChange={e => setShopForm(p => ({ ...p, shopDescription: e.target.value }))} placeholder="Tell customers about your shop..." /></div>
            <button onClick={handleCreateShop} disabled={loading} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-0.5 transition-all disabled:opacity-60">
              {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiPlus className="w-4 h-4" />} Create Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const statCards = stats ? [
    { label: 'Total Products', value: stats.totalProducts || 0, icon: FiPackage, gradient: 'from-blue-500 to-indigo-600' },
    { label: 'Published', value: stats.publishedProducts || 0, icon: FiEye, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: FiShoppingBag, gradient: 'from-violet-500 to-purple-600' },
    { label: 'Revenue', value: `$${(stats.totalRevenue || 0).toFixed(2)}`, icon: FiDollarSign, gradient: 'from-amber-500 to-orange-600' },
  ] : []

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px]">
      {/* Sticky sub-header */}
      <div className="bg-white/80 dark:bg-[#07070d]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 sticky top-[68px] z-30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                <FiShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-black text-gray-900 dark:text-white leading-none">{shop.shopName}</h1>
                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mt-0.5 ${shop.shopStatus === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${shop.shopStatus === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} /> {shop.shopStatus}
                </span>
              </div>
            </div>
            <Link to="/seller/products/new" className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-violet-500/25 hover:-translate-y-0.5 transition-all">
              <FiPlus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        {error && <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4 mb-5"><FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" /><span className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</span></div>}
        {success && <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 mb-5"><FiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{success}</span></div>}

        <ScrollableTabs tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map(({ label, value, icon: Icon, gradient }) => (
              <div key={label} className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900 dark:text-white">{value}</p>
                  <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Products ── */}
        {activeTab === 'products' && (
          <div>
            {loading ? <div className="h-48 bg-gray-50 dark:bg-white/3 rounded-2xl animate-pulse" /> : (
              <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="divide-y divide-gray-50 dark:divide-white/5">
                  {products.length === 0 && <div className="p-10 text-center"><p className="text-gray-400 dark:text-gray-500 text-sm mb-3">No products yet</p><Link to="/seller/products/new" className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all"><FiPlus className="w-4 h-4" /> Add First Product</Link></div>}
                  {products.map(p => (
                    <div key={p._id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/5">
                          {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FiImage className="w-4 h-4 text-gray-300 dark:text-gray-700" /></div>}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-[200px]">{p.name}</p>
                          <p className="text-[12px] text-gray-400 dark:text-gray-500">${p.price} · Stock: {p.stock}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${p.isPublished ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/8'}`}>{p.isPublished ? 'Live' : 'Draft'}</span>
                        {!p.isPublished && <button onClick={() => handlePublish(p._id)} className="text-[12px] font-bold text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30 px-3 py-1.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all">Publish</button>}
                        <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"><FiTrash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Orders ── */}
        {activeTab === 'orders' && (
          <div>
            {loading ? <div className="h-48 bg-gray-50 dark:bg-white/3 rounded-2xl animate-pulse" /> : (
              <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="divide-y divide-gray-50 dark:divide-white/5">
                  {orders.length === 0 && <p className="p-6 text-sm text-gray-400 dark:text-gray-500 text-center">No orders yet</p>}
                  {orders.map(order => {
                    const sc = statusMap[order.status] || statusMap.pending
                    const StatusIcon = sc.icon
                    return (
                      <div key={order._id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                        <div>
                          <p className="font-black text-gray-900 dark:text-white text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-[12px] text-gray-400 dark:text-gray-500">{new Date(order.createdAt).toLocaleDateString()} · ${order.totalAmount?.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${sc.class}`}>
                            <StatusIcon className="w-3 h-3" /> {order.status}
                          </span>
                          {(order.status === 'confirmed' || order.status === 'processing') && (
                            <button onClick={() => handleUpdateOrderStatus(order._id, 'shipped')} className="text-[12px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-3 py-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all flex items-center gap-1">
                              <FiTruck className="w-3 h-3" /> Ship
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}