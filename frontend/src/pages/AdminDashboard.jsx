// AdminDashboard.jsx — Premium Redesign
import { useState, useEffect, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API, { orderAPI } from '../services/api'
import { FiUsers, FiShoppingBag, FiGrid, FiPackage, FiDollarSign, FiTrendingUp, FiUserCheck, FiUserX, FiPlus, FiTrash2, FiCheck, FiPause, FiAlertCircle, FiShield, FiLoader, FiImage, FiTruck, FiClock, FiX, FiEye } from 'react-icons/fi'
import { ScrollableTabs } from '../components/Utils'

export default function AdminDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState(null)
  const [users, setUsers] = useState([])
  const [userStatusView, setUserStatusView] = useState('active')
  const [sellers, setSellers] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: '' })

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#07070d] pt-[68px]"><div className="relative"><div className="w-12 h-12 border-[3px] border-violet-100 dark:border-violet-900/30 rounded-full" /><div className="absolute inset-0 w-12 h-12 border-[3px] border-violet-600 rounded-full animate-spin border-t-transparent" /></div></div>
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  useEffect(() => { fetchDashboardData() }, [])

  const fetchDashboardData = async () => { try { setLoading(true); const r = await API.get('/admin/dashboard'); setDashboardData(r.data.stats); setError(null) } catch { setError('Failed to fetch dashboard') } finally { setLoading(false) } }
  const fetchUsers = async (status = 'active') => { try { setLoading(true); const r = await API.get('/admin/users', { params: { status } }); setUsers(r.data.users || r.data || []) } catch { setError('Failed to fetch users') } finally { setLoading(false) } }
  const fetchSellers = async () => { try { setLoading(true); const r = await API.get('/admin/sellers'); setSellers(r.data.sellers || r.data || []) } catch { setError('Failed to fetch sellers') } finally { setLoading(false) } }
  const fetchCategories = async () => { try { setLoading(true); const r = await API.get('/admin/categories'); setCategories(r.data.categories || r.data || []) } catch { setError('Failed to fetch categories') } finally { setLoading(false) } }
  const fetchProducts = async () => { try { setLoading(true); const r = await API.get('/admin/products'); setProducts(r.data.products || r.data || []) } catch { setError('Failed to fetch products') } finally { setLoading(false) } }
  const fetchOrders = async () => { try { setLoading(true); const r = await orderAPI.getAllOrders(); setOrders(r.data.orders || r.data || []) } catch { setError('Failed to fetch orders') } finally { setLoading(false) } }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'users') { setUserStatusView('active'); fetchUsers('active') }
    else if (tab === 'sellers') fetchSellers()
    else if (tab === 'categories') fetchCategories()
    else if (tab === 'products') fetchProducts()
    else if (tab === 'orders') fetchOrders()
    else fetchDashboardData()
  }

  const handleApproveSeller = async (shopId) => { try { await API.patch(`/admin/sellers/${shopId}/approve`); fetchSellers() } catch { alert('Failed') } }
  const handleSuspendSeller = async (shopId) => { try { await API.patch(`/admin/sellers/${shopId}/suspend`); fetchSellers() } catch { alert('Failed') } }
  const handleDeactivateUser = async (userId) => { if (!window.confirm('Deactivate?')) return; try { await API.patch(`/admin/users/${userId}/deactivate`); fetchUsers(userStatusView) } catch { alert('Failed') } }
  const handleActivateUser = async (userId) => { if (!window.confirm('Activate?')) return; try { await API.patch(`/admin/users/${userId}/activate`); fetchUsers(userStatusView) } catch { alert('Failed') } }
  const handleAddCategory = async (e) => { e.preventDefault(); try { await API.post('/admin/categories', newCategory); setNewCategory({ name: '', description: '', image: '' }); setShowAddCategory(false); fetchCategories() } catch { alert('Failed') } }
  const handleDeleteCategory = async (id) => { if (!window.confirm('Delete?')) return; try { await API.delete(`/admin/categories/${id}`); fetchCategories() } catch { alert('Failed') } }
  const handleDeleteProduct = async (id) => { if (!window.confirm('Delete?')) return; try { await API.delete(`/admin/products/${id}`); fetchProducts() } catch { alert('Failed') } }

  const TABS = [
    { id: 'dashboard', label: 'Overview', icon: FiGrid },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'sellers', label: 'Sellers', icon: FiShoppingBag },
    { id: 'orders', label: 'Orders', icon: FiTrendingUp },
    { id: 'categories', label: 'Categories', icon: FiGrid },
    { id: 'products', label: 'Products', icon: FiPackage },
  ]

  const statCards = dashboardData ? [
    { label: 'Total Users', value: dashboardData.totalUsers, icon: FiUsers, gradient: 'from-blue-500 to-indigo-600', light: 'bg-blue-50 dark:bg-blue-500/10' },
    { label: 'Active Users', value: dashboardData.activeUsers, icon: FiUserCheck, gradient: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Active Sellers', value: dashboardData.activeSellers, icon: FiShoppingBag, gradient: 'from-violet-500 to-purple-600', light: 'bg-violet-50 dark:bg-violet-500/10' },
    { label: 'Categories', value: dashboardData.totalCategories, icon: FiGrid, gradient: 'from-amber-500 to-orange-600', light: 'bg-amber-50 dark:bg-amber-500/10' },
    { label: 'Products', value: dashboardData.totalProducts, icon: FiPackage, gradient: 'from-cyan-500 to-blue-600', light: 'bg-cyan-50 dark:bg-cyan-500/10' },
    { label: 'Orders', value: dashboardData.totalOrders, icon: FiTrendingUp, gradient: 'from-pink-500 to-rose-600', light: 'bg-pink-50 dark:bg-pink-500/10' },
    { label: 'Inactive Users', value: dashboardData.inactiveUsers, icon: FiUserX, gradient: 'from-red-500 to-rose-600', light: 'bg-red-50 dark:bg-red-500/10' },
    { label: 'Revenue', value: `$${dashboardData.totalRevenue?.toFixed(2) || '0.00'}`, icon: FiDollarSign, gradient: 'from-indigo-500 to-violet-600', light: 'bg-indigo-50 dark:bg-indigo-500/10' },
  ] : []

  const inputClass = "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/8 transition-all"

  const orderStatusMap = {
    pending: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
    processing: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    shipped: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20',
    delivered: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
    cancelled: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20',
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#07070d] pt-[68px]">
      {/* Sticky sub-header */}
      <div className="bg-white/80 dark:bg-[#07070d]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 sticky top-[68px] z-30">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest">Admin Panel</p>
              <h1 className="text-xl font-black text-gray-900 dark:text-white">Dashboard</h1>
            </div>
            <span className="text-[12px] font-semibold text-gray-400 dark:text-gray-500">Logged in as <span className="text-gray-700 dark:text-gray-300 font-bold">{user.name}</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        {error && <div className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-4 mb-6"><FiAlertCircle className="w-4 h-4 text-red-500" /><span className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</span></div>}

        {/* Tabs */}
        <ScrollableTabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

        {/* ── Dashboard ── */}
        {activeTab === 'dashboard' && (
          <div>
            {loading ? <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="h-24 bg-gray-50 dark:bg-white/3 rounded-2xl animate-pulse" />)}</div> : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map(({ label, value, icon: Icon, gradient, light }) => (
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
          </div>
        )}

        {/* ── Users ── */}
        {activeTab === 'users' && (
          <div>
            <div className="flex gap-2 mb-5">
              {['active', 'inactive'].map(s => (
                <button key={s} onClick={() => { setUserStatusView(s); fetchUsers(s) }} className={`px-4 py-2 rounded-xl text-[13px] font-bold capitalize transition-all ${userStatusView === s ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/8'}`}>{s}</button>
              ))}
            </div>
            {loading ? <div className="h-48 bg-gray-50 dark:bg-white/3 rounded-2xl animate-pulse" /> : (
              <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="divide-y divide-gray-50 dark:divide-white/5">
                  {users.length === 0 && <p className="p-6 text-sm text-gray-400 dark:text-gray-500 text-center">No users found</p>}
                  {users.map(u => (
                    <div key={u._id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">{u.name?.[0]?.toUpperCase()}</div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{u.name}</p>
                          <p className="text-[12px] text-gray-400 dark:text-gray-500">{u.email} · <span className="capitalize">{u.role}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${u.isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                        {u.isActive ? (
                          <button onClick={() => handleDeactivateUser(u._id)} className="text-[12px] font-bold text-red-500 border border-red-200 dark:border-red-500/30 px-3 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">Deactivate</button>
                        ) : (
                          <button onClick={() => handleActivateUser(u._id)} className="text-[12px] font-bold text-emerald-600 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all">Activate</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Sellers ── */}
        {activeTab === 'sellers' && (
          <div>
            {loading ? <div className="h-48 bg-gray-50 dark:bg-white/3 rounded-2xl animate-pulse" /> : (
              <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="divide-y divide-gray-50 dark:divide-white/5">
                  {sellers.length === 0 && <p className="p-6 text-sm text-gray-400 dark:text-gray-500 text-center">No sellers found</p>}
                  {sellers.map(s => (
                    <div key={s._id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{s.shopName}</p>
                        <p className="text-[12px] text-gray-400 dark:text-gray-500">{s.seller?.name} · {s.seller?.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${s.shopStatus === 'active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : s.shopStatus === 'pending' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'}`}>{s.shopStatus}</span>
                        {s.shopStatus !== 'active' && <button onClick={() => handleApproveSeller(s._id)} className="text-[12px] font-bold text-emerald-600 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all">Approve</button>}
                        {s.shopStatus === 'active' && <button onClick={() => handleSuspendSeller(s._id)} className="text-[12px] font-bold text-red-500 border border-red-200 dark:border-red-500/30 px-3 py-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">Suspend</button>}
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
                  {orders.length === 0 && <p className="p-6 text-sm text-gray-400 dark:text-gray-500 text-center">No orders found</p>}
                  {orders.map(order => (
                    <div key={order._id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-[12px] text-gray-400 dark:text-gray-500">{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} items</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border capitalize ${orderStatusMap[order.status] || ''}`}>{order.status}</span>
                        <span className="font-black text-gray-900 dark:text-white text-sm">${order.totalAmount?.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Categories ── */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowAddCategory(!showAddCategory)} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-violet-500/25 transition-all">
                <FiPlus className="w-4 h-4" /> Add Category
              </button>
            </div>
            {showAddCategory && (
              <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-5 mb-5">
                <h3 className="font-black text-gray-900 dark:text-white text-sm mb-4">New Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-3">
                  <input type="text" className={inputClass} placeholder="Category name *" value={newCategory.name} onChange={e => setNewCategory(p => ({ ...p, name: e.target.value }))} required />
                  <input type="text" className={inputClass} placeholder="Description" value={newCategory.description} onChange={e => setNewCategory(p => ({ ...p, description: e.target.value }))} />
                  <input type="url" className={inputClass} placeholder="Image URL" value={newCategory.image} onChange={e => setNewCategory(p => ({ ...p, image: e.target.value }))} />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg transition-all"><FiPlus className="w-4 h-4" /> Create</button>
                    <button type="button" onClick={() => setShowAddCategory(false)} className="px-5 py-2.5 border border-gray-200 dark:border-white/8 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">Cancel</button>
                  </div>
                </form>
              </div>
            )}
            {loading ? <div className="h-48 bg-gray-50 dark:bg-white/3 rounded-2xl animate-pulse" /> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => (
                  <div key={cat._id} className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 p-4 flex items-center justify-between hover:border-gray-200 dark:hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/5">
                        {cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FiImage className="w-4 h-4 text-gray-300 dark:text-gray-700" /></div>}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{cat.name}</p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate max-w-[120px]">{cat.description || 'No description'}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteCategory(cat._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Products ── */}
        {activeTab === 'products' && (
          <div>
            {loading ? <div className="h-48 bg-gray-50 dark:bg-white/3 rounded-2xl animate-pulse" /> : (
              <div className="bg-white dark:bg-[#0c0c14] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden">
                <div className="divide-y divide-gray-50 dark:divide-white/5">
                  {products.length === 0 && <p className="p-6 text-sm text-gray-400 dark:text-gray-500 text-center">No products found</p>}
                  {products.map(p => (
                    <div key={p._id} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-white/5">
                          {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FiImage className="w-4 h-4 text-gray-300 dark:text-gray-700" /></div>}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm truncate max-w-[240px]">{p.name}</p>
                          <p className="text-[12px] text-gray-400 dark:text-gray-500">${p.price} · {p.category} · Stock: {p.stock}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}