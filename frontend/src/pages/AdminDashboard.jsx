import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { adminAPI } from '../services/api'
import { Loading, ErrorAlert } from '../components/Utils'

export default function AdminDashboard() {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      if (activeTab === 'overview') {
        // Fetch dashboard stats
        const statsRes = await adminAPI.getDashboardStats()
        setStats(statsRes.data)
      } else if (activeTab === 'users') {
        // Fetch all users
        const usersRes = await adminAPI.getAllUsers()
        setUsers(usersRes.data)
      }
      
      setError('')
    } catch (err) {
      setError('Failed to load data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  useEffect(() => {
    fetchData()
  }, [activeTab])

  if (loading) return <Loading />

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.name}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex gap-4 border-b">
          {['overview', 'users', 'products', 'orders'].map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 font-medium border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorAlert message={error} />}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium">Total Users</h3>
                <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
              </div>
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium">Total Products</h3>
                <p className="text-4xl font-bold mt-2">{stats.totalProducts}</p>
              </div>
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium">Total Orders</h3>
                <p className="text-4xl font-bold mt-2">{stats.totalOrders}</p>
              </div>
              <div className="card">
                <h3 className="text-gray-600 text-sm font-medium">Revenue</h3>
                <p className="text-4xl font-bold mt-2 text-blue-600">${stats.totalRevenue?.toFixed(2)}</p>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders?.map(order => (
                      <tr key={order._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{order.orderNumber}</td>
                        <td className="py-3 px-4">{order.user?.name}</td>
                        <td className="py-3 px-4 font-semibold">${order.totalAmount.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded text-white text-sm ${
                            order.status === 'delivered' ? 'bg-green-500' :
                            order.status === 'shipped' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-semibold">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 rounded bg-blue-100 text-blue-800 text-sm">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">{user.phone}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded text-white text-sm ${
                          user.isActive ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Product Management</h2>
              <Link to="/admin/products/new" className="btn-primary">
                Add New Product
              </Link>
            </div>
            <p className="text-gray-600">Product management interface coming soon</p>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Order Management</h2>
            <p className="text-gray-600">Order management interface coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
