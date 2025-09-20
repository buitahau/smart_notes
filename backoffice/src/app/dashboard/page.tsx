'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Activity,
  Settings,
  Home,
  BarChart3,
  Clock,
  Target,
  Star
} from 'lucide-react'

const dailyData = [
  { date: '2024-01-01', notes: 12 },
  { date: '2024-01-02', notes: 19 },
  { date: '2024-01-03', notes: 8 },
  { date: '2024-01-04', notes: 15 },
  { date: '2024-01-05', notes: 22 },
  { date: '2024-01-06', notes: 18 },
  { date: '2024-01-07', notes: 25 },
  { date: '2024-01-08', notes: 14 },
  { date: '2024-01-09', notes: 20 },
  { date: '2024-01-10', notes: 17 },
  { date: '2024-01-11', notes: 23 },
  { date: '2024-01-12', notes: 16 },
  { date: '2024-01-13', notes: 28 },
  { date: '2024-01-14', notes: 21 }
]

const monthlyData = [
  { month: 'Jan', notes: 342 },
  { month: 'Feb', notes: 287 },
  { month: 'Mar', notes: 415 },
  { month: 'Apr', notes: 378 },
  { month: 'May', notes: 456 },
  { month: 'Jun', notes: 389 },
  { month: 'Jul', notes: 523 },
  { month: 'Aug', notes: 467 },
  { month: 'Sep', notes: 412 },
  { month: 'Oct', notes: 398 },
  { month: 'Nov', notes: 445 },
  { month: 'Dec', notes: 478 }
]

const yearlyData = [
  { year: '2020', notes: 2847 },
  { year: '2021', notes: 3456 },
  { year: '2022', notes: 4123 },
  { year: '2023', notes: 4892 },
  { year: '2024', notes: 5234 }
]

const categoryData = [
  { name: 'Work', value: 35, color: '#3b82f6' },
  { name: 'Personal', value: 25, color: '#10b981' },
  { name: 'Ideas', value: 20, color: '#f59e0b' },
  { name: 'Tasks', value: 15, color: '#ef4444' },
  { name: 'Other', value: 5, color: '#8b5cf6' }
]

const statsCards = [
  {
    title: 'Total Notes',
    value: '5,234',
    change: '+12%',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'This Month',
    value: '478',
    change: '+8%',
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Active Days',
    value: '287',
    change: '+15%',
    icon: Activity,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    title: 'Avg Daily',
    value: '18.2',
    change: '+5%',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
]

const recentActivity = [
  { type: 'note', title: 'Project Meeting Notes', time: '2 hours ago', icon: FileText },
  { type: 'task', title: 'Complete dashboard design', time: '4 hours ago', icon: Target },
  { type: 'note', title: 'AI Integration Ideas', time: '1 day ago', icon: FileText },
  { type: 'chat', title: 'Team sync discussion', time: '2 days ago', icon: Users }
]

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState<'daily' | 'monthly' | 'yearly'>('monthly')

  const getChartData = () => {
    switch (timeRange) {
      case 'daily':
        return dailyData
      case 'yearly':
        return yearlyData
      default:
        return monthlyData
    }
  }

  const getXAxisKey = () => {
    switch (timeRange) {
      case 'daily':
        return 'date'
      case 'yearly':
        return 'year'
      default:
        return 'month'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Track your note creation and productivity</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setTimeRange('daily')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === 'daily'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setTimeRange('monthly')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === 'monthly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeRange('yearly')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === 'yearly'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Yearly
                </button>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Notes Created Over Time</h2>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {timeRange === 'daily' ? 'Last 14 days' : timeRange === 'monthly' ? 'This year' : 'Last 5 years'}
                </span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={getXAxisKey()} />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="notes"
                    stroke="#3b82f6"
                    fill="url(#colorGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Note Categories</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Comparison</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="notes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Yearly Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="notes"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <activity.icon className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
                <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                  {activity.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}