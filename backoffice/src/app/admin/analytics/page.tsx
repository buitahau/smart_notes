'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { BarChart3, TrendingUp, Users, FileText } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <AdminLayout
      title="Analytics"
      description="Detailed analytics and reports"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">1,234,567</p>
              <p className="text-sm text-green-600 mt-1">+23.5% this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">8,945</p>
              <p className="text-sm text-green-600 mt-1">+12.3% this month</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900">23.4%</p>
              <p className="text-sm text-red-600 mt-1">-2.1% this month</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Session</p>
              <p className="text-2xl font-bold text-gray-900">4m 32s</p>
              <p className="text-sm text-green-600 mt-1">+18s this month</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Advanced Analytics</h2>
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
          <p className="text-gray-500">Advanced analytics and reporting features coming soon</p>
        </div>
      </div>
    </AdminLayout>
  )
}