'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  HelpCircle,
  Star
} from 'lucide-react'

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(3)

  const user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    avatar: '/placeholder-avatar.jpg',
    plan: 'Pro',
    joinedDate: 'March 2024'
  }

  const menuItems = [
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: Bell, label: 'Notifications', href: '/notifications', badge: notifications },
    { icon: HelpCircle, label: 'Help & Support', href: '/help' },
    { icon: Star, label: 'Upgrade Plan', href: '/pricing', highlight: true }
  ]

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors mr-2">
        <Bell className="w-5 h-5" />
        {notifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications}
          </span>
        )}
      </button>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.plan} Plan</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">Member since {user.joinedDate}</p>
                  </div>
                </div>
              </div>

              {/* Plan Status */}
              <div className="px-4 py-3 bg-blue-50 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">{user.plan} Plan</p>
                    <p className="text-xs text-blue-600">Manage your subscription</p>
                  </div>
                  <Link href="/billing" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Manage
                  </Link>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                      item.highlight ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className={`w-4 h-4 ${item.highlight ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                    {item.highlight && (
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">
                        NEW
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 my-2"></div>

              {/* Logout */}
              <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}