'use client'

import { useState } from 'react'
import {
  Users,
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Mail,
  Calendar,
  FileText,
  UserX,
  UserCheck,
  Shield
} from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

const mockUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    plan: 'Pro',
    joined: '2024-01-15',
    lastActive: '2024-01-20',
    notes: 156,
    status: 'active',
    revenue: 108.00
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    plan: 'Free',
    joined: '2024-01-14',
    lastActive: '2024-01-19',
    notes: 89,
    status: 'active',
    revenue: 0.00
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    plan: 'Team',
    joined: '2024-01-13',
    lastActive: '2024-01-20',
    notes: 234,
    status: 'active',
    revenue: 232.00
  },
  {
    id: 4,
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@email.com',
    plan: 'Pro',
    joined: '2024-01-12',
    lastActive: '2024-01-10',
    notes: 178,
    status: 'inactive',
    revenue: 108.00
  },
  {
    id: 5,
    name: 'Lisa Wang',
    email: 'lisa.wang@email.com',
    plan: 'Free',
    joined: '2024-01-11',
    lastActive: '2024-01-18',
    notes: 45,
    status: 'active',
    revenue: 0.00
  },
  {
    id: 6,
    name: 'David Brown',
    email: 'david.brown@email.com',
    plan: 'Team',
    joined: '2024-01-10',
    lastActive: '2024-01-20',
    notes: 312,
    status: 'active',
    revenue: 464.00
  },
  {
    id: 7,
    name: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    plan: 'Pro',
    joined: '2024-01-09',
    lastActive: '2024-01-17',
    notes: 98,
    status: 'active',
    revenue: 108.00
  },
  {
    id: 8,
    name: 'Tom Wilson',
    email: 'tom.wilson@email.com',
    plan: 'Free',
    joined: '2024-01-08',
    lastActive: '2024-01-05',
    notes: 23,
    status: 'inactive',
    revenue: 0.00
  }
]

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesPlan = planFilter === 'all' || user.plan === planFilter

    return matchesSearch && matchesStatus && matchesPlan
  })

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  const planColors = {
    Free: 'bg-gray-100 text-gray-800',
    Pro: 'bg-blue-100 text-blue-800',
    Team: 'bg-purple-100 text-purple-800'
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800'
  }

  const totalUsers = mockUsers.length
  const activeUsers = mockUsers.filter(u => u.status === 'active').length
  const totalRevenue = mockUsers.reduce((sum, u) => sum + u.revenue, 0)
  const avgNotesPerUser = Math.round(mockUsers.reduce((sum, u) => sum + u.notes, 0) / totalUsers)

  return (
    <AdminLayout
      title="Users Management"
      description="Manage and monitor all platform users"
    >
      <div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-sm text-green-600 mt-1">+12.5% this month</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                <p className="text-sm text-green-600 mt-1">+8.2% this month</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-green-600 mt-1">+15.7% this month</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Notes/User</p>
                <p className="text-2xl font-bold text-gray-900">{avgNotesPerUser}</p>
                <p className="text-sm text-green-600 mt-1">+3.2% this month</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Plans</option>
                <option value="Free">Free</option>
                <option value="Pro">Pro</option>
                <option value="Team">Team</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleAllUsers}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  {selectedUsers.length > 0 ? `${selectedUsers.length} selected` : `${filteredUsers.length} users`}
                </span>
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                    Delete Selected
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    Export Selected
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleAllUsers}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${planColors[user.plan as keyof typeof planColors]}`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                        }`}></span>
                        <span className={`text-xs ${statusColors[user.status as keyof typeof statusColors]}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.notes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${user.revenue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joined}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}