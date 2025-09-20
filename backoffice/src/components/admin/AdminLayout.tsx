'use client'

import { ReactNode } from 'react'
import { useAdminAuth } from '@/lib/auth/admin-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminSidebar from './AdminSidebar'
import { Shield, AlertCircle } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const { isAdmin, loading } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/admin/login')
    }
  }, [isAdmin, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                )}
                {description && (
                  <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800 font-medium">Admin Mode</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}