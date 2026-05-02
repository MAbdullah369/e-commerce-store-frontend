// AdminDashboard.jsx
import { useState, useEffect, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import API from '../services/api'
import { FiUsers, FiShoppingBag, FiGrid, FiPackage, FiDollarSign, FiTrendingUp, FiUserCheck, FiUserX, FiPlus, FiTrash2, FiCheck, FiPause, FiAlertCircle, FiShield, FiLoader, FiImage } from 'react-icons/fi'

export default function AdminDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [dashboardData, setDashboardData] = useState(null)
  const [users, setUsers] = useState([])
  const [userStatusView, setUserStatusView] = useState('active')
  const [sellers, setSellers] = useState([])
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', description: '', image: '' })

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-6 text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  useEffect(() => { fetchDashboardData() }, [])

  const fetchDashboardData = async () => { try { setLoading(true); const r = await API.get('/admin/dashboard'); setDashboardData(r.data.stats); setError(null) } catch { setError('Failed to fetch dashboard data') } finally { setLoading(false) } }
  const fetchUsers = async (status = 'active') => { try { setLoading(true); const r = await API.get('/admin/users', { params: { status } }); setUsers(r.data.users || r.data || []); setError(null) } catch { setError('Failed to fetch users') } finally { setLoading(false) } }
  const fetchSellers = async () => { try { setLoading(true); const r = await API.get('/admin/sellers'); setSellers(r.data.sellers || r.data || []); setError(null) } catch { setError('Failed to fetch sellers') } finally { setLoading(false) } }
  const fetchCategories = async () => { try { setLoading(true); const r = await API.get('/admin/categories'); setCategories(r.data.categories || r.data || []); setError(null) } catch { setError('Failed to fetch categories') } finally { setLoading(false) } }
  const fetchProducts = async () => { try { setLoading(true); const r = await API.get('/admin/products'); setProducts(r.data.products || r.data || []); setError(null) } catch { setError('Failed to fetch products') } finally { setLoading(false) } }

  const handleTabChange = (tab) => { setActiveTab(tab); if (tab === 'users') { setUserStatusView('active'); fetchUsers('active') } else if (tab === 'sellers') fetchSellers(); else if (tab === 'categories') fetchCategories(); else if (tab === 'products') fetchProducts(); else if (tab === 'dashboard') fetchDashboardData() }

  const handleApproveSeller = async (shopId) => { try { await API.patch(`/admin/sellers/${shopId}/approve`); fetchSellers() } catch { alert('Failed to approve') } }
  const handleSuspendSeller = async (shopId) => { try { await API.patch(`/admin/sellers/${shopId}/suspend`); fetchSellers() } catch { alert('Failed to suspend') } }
  const handleDeactivateUser = async (userId) => { if (!window.confirm('Deactivate?')) return; try { await API.patch(`/admin/users/${userId}/deactivate`); fetchUsers(userStatusView) } catch { alert('Failed') } }
  const handleActivateUser = async (userId) => { if (!window.confirm('Activate?')) return; try { await API.patch(`/admin/users/${userId}/activate`); fetchUsers(userStatusView) } catch { alert('Failed') } }
  const handleAddCategory = async (e) => { e.preventDefault(); try { await API.post('/admin/categories', newCategory); setNewCategory({ name: '', description: '', image: '' }); setShowAddCategory(false); fetchCategories() } catch { alert('Failed') } }
  const handleDeleteCategory = async (id) => { if (!window.confirm('Delete?')) return; try { await API.delete(`/admin/categories/${id}`); fetchCategories() } catch { alert('Failed') } }
  const handleDeleteProduct = async (id) => { if (!window.confirm('Delete?')) return; try { await API.delete(`/admin/products/${id}`); fetchProducts() } catch { alert('Failed') } }

  const TAB_CONFIG = [
    { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
    { id: 'users', label: 'Users', icon: FiUsers },
    { id: 'sellers', label: 'Sellers', icon: FiShoppingBag },
    { id: 'categories', label: 'Categories', icon: FiPackage },
    { id: 'products', label: 'Products', icon: FiPackage },
  ]

  const statCards = dashboardData ? [
    { label: 'Total Users', value: dashboardData.totalUsers, icon: FiUsers, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Active Users', value: dashboardData.activeUsers, icon: FiUserCheck, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Inactive Users', value: dashboardData.inactiveUsers, icon: FiUserX, gradient: 'from-red-500 to-rose-500' },
    { label: 'Active Sellers', value: dashboardData.activeSellers, icon: FiShoppingBag, gradient: 'from-green-500 to-emerald-500' },
    { label: 'Categories', value: dashboardData.totalCategories, icon: FiGrid, gradient: 'from-violet-500 to-purple-500' },
    { label: 'Products', value: dashboardData.totalProducts, icon: FiPackage, gradient: 'from-orange-500 to-amber-500' },
    { label: 'Orders', value: dashboardData.totalOrders, icon: FiTrendingUp, gradient: 'from-pink-500 to-rose-500' },
    { label: 'Revenue', value: `$${dashboardData.totalRevenue?.toFixed(2) || '0.00'}`, icon: FiDollarSign, gradient: 'from-indigo-500 to-blue-500' },
  ] : []

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20"><FiShield className="w-5 h-5 text-white" /></div>
                Admin Dashboard
              </h1>
              <p className="text-gray-500 text-sm mt-1">Welcome, <span className="font-semibold text-accent-600">{user.name}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 mb-6 animate-slide-in-right"><FiAlertCircle className="w-5 h-5 text-red-500" /><span className="text-sm text-red-700">{error}</span></div>}

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
          {TAB_CONFIG.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => handleTabChange(id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === id ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {loading && <div className="flex justify-center py-12"><div className="relative"><div className="w-10 h-10 border-3 border-gray-200 rounded-full" /><div className="absolute top-0 left-0 w-10 h-10 border-3 border-primary-600 rounded-full animate-spin border-t-transparent" /></div></div>}

        {/* Dashboard */}
        {activeTab === 'dashboard' && !loading && dashboardData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {statCards.map(({ label, value, icon: Icon, gradient }) => (
              <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />
                <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}><Icon className="w-5 h-5 text-white" /></div>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-1">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="flex flex-wrap items-center justify-between gap-3 p-6 border-b border-gray-100">
              <div className="flex gap-2">
                {['active', 'inactive'].map(status => (
                  <button key={status} onClick={() => { setUserStatusView(status); fetchUsers(status) }} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${userStatusView === status ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {status === 'active' ? 'Active' : 'Inactive'} Users
                  </button>
                ))}
              </div>
            </div>
            {users.length === 0 ? (
              <div className="text-center py-16"><FiUsers className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-400">No {userStatusView} users found</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b"><tr>{['User', 'Email', 'Role', 'Status', 'Actions'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">{u.name?.[0]?.toUpperCase()}</div><span className="font-semibold text-gray-900 text-sm">{u.name}</span></div></td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{u.email}</td>
                        <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-violet-50 text-violet-700 border border-violet-200' : u.role === 'seller' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>{u.role}</span></td>
                        <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${u.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}><span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />{u.isActive ? 'Active' : 'Inactive'}</span></td>
                        <td className="px-6 py-4">
                          {u.isActive && u.role !== 'admin' && <button onClick={() => handleDeactivateUser(u._id)} className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all">Deactivate</button>}
                          {!u.isActive && <button onClick={() => handleActivateUser(u._id)} className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-all">Activate</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Sellers */}
        {activeTab === 'sellers' && !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
            {sellers.length === 0 ? (
              <div className="text-center py-16"><FiShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-400">No sellers found</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b"><tr>{['Shop', 'Seller', 'Status', 'Products', 'Actions'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {sellers.map(shop => (
                      <tr key={shop._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4"><div className="font-semibold text-gray-900 text-sm">{shop.shopName}</div><div className="text-xs text-gray-500 mt-0.5">{shop.seller?.email}</div></td>
                        <td className="px-6 py-4"><div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{shop.seller?.name?.[0]}</div><span className="text-gray-700 text-sm">{shop.seller?.name}</span></div></td>
                        <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${shop.shopStatus === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : shop.shopStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}><span className={`w-1.5 h-1.5 rounded-full ${shop.shopStatus === 'active' ? 'bg-emerald-500' : shop.shopStatus === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`} />{shop.shopStatus}</span></td>
                        <td className="px-6 py-4 text-center font-semibold text-sm">{shop.publishedProducts || 0}</td>
                        <td className="px-6 py-4 flex gap-2">
                          {shop.shopStatus !== 'active' && <button onClick={() => handleApproveSeller(shop._id)} className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-all flex items-center gap-1"><FiCheck className="w-3 h-3" /> Approve</button>}
                          {shop.shopStatus === 'active' && <button onClick={() => handleSuspendSeller(shop._id)} className="text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-all flex items-center gap-1"><FiPause className="w-3 h-3" /> Suspend</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Categories */}
        {activeTab === 'categories' && !loading && (
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <button onClick={() => setShowAddCategory(!showAddCategory)} className="btn-primary flex items-center gap-2"><FiPlus className="w-4 h-4" /> {showAddCategory ? 'Cancel' : 'Add Category'}</button>
            </div>
            {showAddCategory && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 animate-fade-in">
                <h3 className="text-lg font-bold text-gray-900 mb-5">New Category</h3>
                <form onSubmit={handleAddCategory} className="space-y-4 max-w-lg">
                  <div><label className="label">Name *</label><input type="text" className="input-field" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} required placeholder="e.g. Electronics" /></div>
                  <div><label className="label">Description</label><textarea className="input-field" rows="2" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} placeholder="Category description..." /></div>
                  <div><label className="label">Image URL</label><input type="url" className="input-field" value={newCategory.image} onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })} placeholder="https://..." /></div>
                  <button type="submit" className="btn-secondary py-2.5 flex items-center gap-2"><FiCheck className="w-4 h-4" /> Create</button>
                </form>
              </div>
            )}
            {categories.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100"><FiGrid className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-400">No categories</p></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map(cat => (
                  <div key={cat._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    {cat.image && <div className="h-40 overflow-hidden"><img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h3>
                      <p className="text-gray-500 text-sm mb-4">{cat.description || 'No description'}</p>
                      <button onClick={() => handleDeleteCategory(cat._id)} className="w-full btn-danger text-sm py-2 flex items-center justify-center gap-1.5"><FiTrash2 className="w-3.5 h-3.5" /> Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Products */}
        {activeTab === 'products' && !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
            {products.length === 0 ? (
              <div className="text-center py-16"><FiPackage className="w-10 h-10 text-gray-300 mx-auto mb-3" /><p className="text-gray-400">No products</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100/80 border-b"><tr>{['Product', 'Seller', 'Price', 'Stock', 'Status', 'Actions'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4"><p className="font-semibold text-gray-900 text-sm">{p.name}</p><p className="text-xs text-gray-400 mt-0.5">{p.category}</p></td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{p.seller?.name || 'N/A'}</td>
                        <td className="px-6 py-4 font-bold text-primary-600 text-sm">${p.price?.toFixed(2)}</td>
                        <td className="px-6 py-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.stock > 10 ? 'bg-emerald-50 text-emerald-700' : p.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{p.stock}</span></td>
                        <td className="px-6 py-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${p.isPublished ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}><span className={`w-1.5 h-1.5 rounded-full ${p.isPublished ? 'bg-emerald-500' : 'bg-gray-400'}`} />{p.isPublished ? 'Live' : 'Draft'}</span></td>
                        <td className="px-6 py-4"><button onClick={() => handleDeleteProduct(p._id)} className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-all flex items-center gap-1"><FiTrash2 className="w-3 h-3" /> Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}