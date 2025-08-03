import type React from "react"
import { useState } from "react"
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Moon, Sun } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    leaveRequests: true,
    systemUpdates: false,
  })
  const [theme, setTheme] = useState("system")
  const { userProfile } = useAuth()

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
  ]

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Settings
        </h1>
        <p className="text-base-content/60">Manage your account preferences and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body p-4">
              <ul className="menu p-0 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <li key={tab.id}>
                      <button
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors w-full ${
                          activeTab === tab.id ? "bg-primary text-primary-content" : "hover:bg-base-200"
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              {activeTab === "general" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">General Settings</h2>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Language</span>
                    </label>
                    <select className="select select-bordered w-full max-w-xs">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Time Zone</span>
                    </label>
                    <select className="select select-bordered w-full max-w-xs">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (Central European Time)</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date Format</span>
                    </label>
                    <select className="select select-bordered w-full max-w-xs">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Email Notifications</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notifications.email}
                          onChange={() => handleNotificationChange('email')}
                        />
                      </label>
                      <div className="label">
                        <span className="label-text-alt">Receive notifications via email</span>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Push Notifications</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notifications.push}
                          onChange={() => handleNotificationChange('push')}
                        />
                      </label>
                      <div className="label">
                        <span className="label-text-alt">Receive browser push notifications</span>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Leave Request Updates</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notifications.leaveRequests}
                          onChange={() => handleNotificationChange('leaveRequests')}
                        />
                      </label>
                      <div className="label">
                        <span className="label-text-alt">Get notified about leave request status changes</span>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">System Updates</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-primary"
                          checked={notifications.systemUpdates}
                          onChange={() => handleNotificationChange('systemUpdates')}
                        />
                      </label>
                      <div className="label">
                        <span className="label-text-alt">Receive notifications about system updates and maintenance</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="card bg-base-200">
                      <div className="card-body">
                        <h3 className="card-title text-lg">Password</h3>
                        <p className="text-base-content/60">Change your account password</p>
                        <div className="card-actions">
                          <button className="btn btn-primary btn-sm">Change Password</button>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-base-200">
                      <div className="card-body">
                        <h3 className="card-title text-lg">Two-Factor Authentication</h3>
                        <p className="text-base-content/60">Add an extra layer of security to your account</p>
                        <div className="card-actions">
                          <button className="btn btn-outline btn-sm">Enable 2FA</button>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-base-200">
                      <div className="card-body">
                        <h3 className="card-title text-lg">Active Sessions</h3>
                        <p className="text-base-content/60">Manage your active login sessions</p>
                        <div className="card-actions">
                          <button className="btn btn-outline btn-sm">View Sessions</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Appearance Settings</h2>
                  
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Theme</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="label cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          className="radio radio-primary"
                          value="light"
                          checked={theme === "light"}
                          onChange={(e) => setTheme(e.target.value)}
                        />
                        <span className="label-text ml-2 flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </span>
                      </label>
                      <label className="label cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          className="radio radio-primary"
                          value="dark"
                          checked={theme === "dark"}
                          onChange={(e) => setTheme(e.target.value)}
                        />
                        <span className="label-text ml-2 flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </span>
                      </label>
                      <label className="label cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          className="radio radio-primary"
                          value="system"
                          checked={theme === "system"}
                          onChange={(e) => setTheme(e.target.value)}
                        />
                        <span className="label-text ml-2 flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          System
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Compact Mode</span>
                    </label>
                    <input type="checkbox" className="toggle toggle-primary" />
                    <div className="label">
                      <span className="label-text-alt">Use a more compact layout to fit more content</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="divider"></div>
              <div className="flex justify-end">
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings