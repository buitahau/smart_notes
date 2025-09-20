'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface AdminUser {
  email: string
  role: string
}

interface AdminAuthContextType {
  isAdmin: boolean
  adminUser: AdminUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing admin session on mount
    const checkAdminAuth = () => {
      try {
        const auth = localStorage.getItem('adminAuth')
        const user = localStorage.getItem('adminUser')

        if (auth === 'true' && user) {
          setIsAdmin(true)
          setAdminUser(JSON.parse(user))
        }
      } catch (error) {
        console.error('Error checking admin auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAdminAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    if (email === 'admin@smartnotes.com' && password === 'admin123') {
      const userData: AdminUser = { email, role: 'admin' }
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminUser', JSON.stringify(userData))
      setIsAdmin(true)
      setAdminUser(userData)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
    setIsAdmin(false)
    setAdminUser(null)
  }

  return (
    <AdminAuthContext.Provider value={{ isAdmin, adminUser, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}