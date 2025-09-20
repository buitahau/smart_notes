'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FileText, Home, BarChart3, Settings, User } from 'lucide-react'
import UserMenu from './UserMenu'
import { useAdminAuth } from '@/lib/auth/admin-context'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { isAdmin } = useAdminAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">Smart Notes</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
            Dashboard
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
              Admin
            </Link>
          )}
          <Link href="/features" className="text-gray-600 hover:text-gray-900 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </Link>
          <Link href="/dashboard" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300">
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Dashboard
          </Link>
        </div>

        <UserMenu />
      </div>
    </nav>
  )
}