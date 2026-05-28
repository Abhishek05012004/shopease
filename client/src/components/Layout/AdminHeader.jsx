"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { User, Menu, X, Bell, Store, Settings, LogOut, Package, ShoppingCart, Users, BarChart3 } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { ordersAPI } from "../../services/api"

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch recent orders for notifications
    const fetchNotifications = async () => {
      try {
        const response = await ordersAPI.getAllOrders()
        const readIds = JSON.parse(localStorage.getItem("readOrderNotifications") || "[]")
        const recentOrders = response.data
          .filter((order) => {
            const orderDate = new Date(order.createdAt)
            const oneDayAgo = new Date()
            oneDayAgo.setDate(oneDayAgo.getDate() - 1)
            return orderDate >= oneDayAgo && order.status === "Pending" && !readIds.includes(order._id)
          })
          .slice(0, 5)
        setNotifications(recentOrders)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleMarkAllAsRead = () => {
    const readIds = JSON.parse(localStorage.getItem("readOrderNotifications") || "[]")
    notifications.forEach((order) => {
      if (!readIds.includes(order._id)) {
        readIds.push(order._id)
      }
    })
    localStorage.setItem("readOrderNotifications", JSON.stringify(readIds))
    setNotifications([])
    setShowNotifications(false)
  }

  const handleNotificationClick = (orderId) => {
    const readIds = JSON.parse(localStorage.getItem("readOrderNotifications") || "[]")
    if (!readIds.includes(orderId)) {
      readIds.push(orderId)
      localStorage.setItem("readOrderNotifications", JSON.stringify(readIds))
    }
    setNotifications((prev) => prev.filter((n) => n._id !== orderId))
    navigate(`/admin/orders?highlight=${orderId}`)
    setShowNotifications(false)
  }

  return (
    <header className="bg-slate-800 shadow-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center shrink-0">
              <Store className="text-slate-800 h-6 w-6" />
            </div>
            <div className="hidden min-[380px]:flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-yellow-400">
                ShopEase<span className="hidden sm:inline"> Admin</span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 -mt-1 hidden sm:inline-block">Management Portal</span>
            </div>
          </Link>
 
          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-6">
            <Link
              to="/admin/dashboard"
              className="flex items-center text-slate-300 hover:text-yellow-400 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-slate-700"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center text-slate-300 hover:text-yellow-400 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-slate-700"
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center text-slate-300 hover:text-yellow-400 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-slate-700"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center text-slate-300 hover:text-yellow-400 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-slate-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Link>
          </nav>
 
          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-300 hover:text-yellow-400 transition-colors rounded-lg hover:bg-slate-700"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {notifications.length}
                  </span>
                )}
              </button>
 
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="fixed sm:absolute top-16 sm:top-auto right-4 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-[320px] bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50">
                  <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-white">New Orders ({notifications.length})</h3>
                    {notifications.length > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((order) => (
                        <div
                          key={order._id}
                          className="p-4 border-b border-slate-700 hover:bg-slate-700 cursor-pointer"
                          onClick={() => handleNotificationClick(order._id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">Order #{order._id.slice(-8)}</p>
                              <p className="text-xs text-slate-400">
                                {order.user?.name} • ₹{order.totalPrice}
                              </p>
                            </div>
                            <span className="text-xs text-yellow-400">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-400">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>
 
            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-slate-300 hover:text-yellow-400 transition-colors px-3 py-2 rounded-lg hover:bg-slate-700">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
              </button>
 
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-3 border-b border-slate-700">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
 
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 text-slate-300 hover:text-yellow-400 transition-colors rounded-lg hover:bg-slate-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
 
      {/* Mobile Navigation - positioned absolutely below the header */}
      {isMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-slate-800 border-b border-slate-700 py-4 space-y-1 shadow-2xl z-50">
          <Link
            to="/admin/dashboard"
            className="flex items-center py-2.5 px-4 text-slate-300 hover:text-yellow-400 hover:bg-slate-700 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <BarChart3 className="h-4 w-4 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/admin/products"
            className="flex items-center py-2.5 px-4 text-slate-300 hover:text-yellow-400 hover:bg-slate-700 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Package className="h-4 w-4 mr-3" />
            Products
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center py-2.5 px-4 text-slate-300 hover:text-yellow-400 hover:bg-slate-700 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingCart className="h-4 w-4 mr-3" />
            Orders
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center py-2.5 px-4 text-slate-300 hover:text-yellow-400 hover:bg-slate-700 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Users className="h-4 w-4 mr-3" />
            Users
          </Link>
        </div>
      )}
    </header>
  )
}

export default AdminHeader
