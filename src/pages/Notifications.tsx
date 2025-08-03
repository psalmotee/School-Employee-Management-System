import type React from "react"
import { useState } from "react"
import { Bell, Check, Trash2, Filter, MoreVertical } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: Date
}

const Notifications: React.FC = () => {
  const [filter, setFilter] = useState("all")
  const { userProfile } = useAuth()

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Leave Request Approved",
      message: "Your vacation leave request for Jan 20-25 has been approved by your manager.",
      type: "success",
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: "2",
      title: "New Employee Added",
      message: "John Smith has been added to the Teaching Staff department.",
      type: "info",
      read: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    },
    {
      id: "3",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur tonight from 11 PM to 2 AM.",
      type: "warning",
      read: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: "4",
      title: "Profile Updated",
      message: "Your profile information has been successfully updated.",
      type: "success",
      read: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
  ])

  const filteredNotifications = notifications.filter(notification => {
    if (filter === "unread") return !notification.read
    if (filter === "read") return notification.read
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    const iconClasses = "h-5 w-5"
    switch (type) {
      case "success":
        return <Check className={`${iconClasses} text-success`} />
      case "warning":
        return <Bell className={`${iconClasses} text-warning`} />
      case "error":
        return <Bell className={`${iconClasses} text-error`} />
      default:
        return <Bell className={`${iconClasses} text-info`} />
    }
  }

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "success":
        return "badge-success"
      case "warning":
        return "badge-warning"
      case "error":
        return "badge-error"
      default:
        return "badge-info"
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            Notifications
            {unreadCount > 0 && (
              <div className="badge badge-primary">{unreadCount}</div>
            )}
          </h1>
          <p className="text-base-content/60">Stay updated with your latest activities</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline btn-sm" onClick={markAllAsRead}>
            <Check className="h-4 w-4" />
            Mark All Read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-base-content/60" />
              <span className="font-medium">Filter:</span>
            </div>
            <div className="tabs tabs-boxed">
              <button
                className={`tab ${filter === "all" ? "tab-active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All ({notifications.length})
              </button>
              <button
                className={`tab ${filter === "unread" ? "tab-active" : ""}`}
                onClick={() => setFilter("unread")}
              >
                Unread ({unreadCount})
              </button>
              <button
                className={`tab ${filter === "read" ? "tab-active" : ""}`}
                onClick={() => setFilter("read")}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`card bg-base-100 shadow-lg hover:shadow-xl transition-shadow ${
              !notification.read ? "border-l-4 border-primary" : ""
            }`}
          >
            <div className="card-body">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${!notification.read ? "text-primary" : ""}`}>
                        {notification.title}
                      </h3>
                      <div className={`badge badge-sm ${getNotificationBadge(notification.type)}`}>
                        {notification.type}
                      </div>
                      {!notification.read && (
                        <div className="badge badge-primary badge-sm">New</div>
                      )}
                    </div>
                    <p className="text-base-content/70 text-sm mb-2">{notification.message}</p>
                    <p className="text-xs text-base-content/50">{formatTime(notification.createdAt)}</p>
                  </div>
                </div>
                
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
                    <MoreVertical className="h-4 w-4" />
                  </div>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    {!notification.read && (
                      <li>
                        <button onClick={() => markAsRead(notification.id)}>
                          <Check className="h-4 w-4" />
                          Mark as Read
                        </button>
                      </li>
                    )}
                    <li>
                      <button
                        className="text-error"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-16 w-16 text-base-content/20 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No notifications</h3>
          <p className="text-base-content/60">
            {filter === "unread"
              ? "You're all caught up! No unread notifications."
              : filter === "read"
              ? "No read notifications found."
              : "You don't have any notifications yet."}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Total Notifications</div>
          <div className="stat-value text-primary">{notifications.length}</div>
          <div className="stat-desc">All time</div>
        </div>

        <div className="stat">
          <div className="stat-title">Unread</div>
          <div className="stat-value text-warning">{unreadCount}</div>
          <div className="stat-desc">Require attention</div>
        </div>

        <div className="stat">
          <div className="stat-title">Read</div>
          <div className="stat-value text-success">{notifications.length - unreadCount}</div>
          <div className="stat-desc">Processed</div>
        </div>
      </div>
    </div>
  )
}

export default Notifications