'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import { DollarSign, TrendingUp, CreditCard, Users } from 'lucide-react'

export default function RevenuePage() {
  return (
    <AdminLayout
      title="Revenue"
      description="Revenue tracking and billing"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$48,234</p>
              <p className="text-sm text-green-600 mt-1">+15.7% this month</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">2,156</p>
              <p className="text-sm text-green-600 mt-1">+8.3% this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">12.4%</p>
              <p className="text-sm text-green-600 mt-1">+2.1% this month</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Failed Payments</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-red-600 mt-1">-45% this month</p>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Management</h2>
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Revenue Dashboard</h3>
          <p className="text-gray-500">Revenue tracking and billing management features coming soon</p>
        </div>
      </div>
    </AdminLayout>
  )
}