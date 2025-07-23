import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2Icon } from 'lucide-react';

const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100">
        <Loader2Icon className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-neutral-900">Smart Notes</h1>
          {isAuthenticated && (
            <button
              onClick={() => logout()}
              className="px-3 py-1.5 text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors"
            >
              Sign out
            </button>
          )}
        </div>
      </header>
      
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        {children || <Outlet />}
      </main>
      
      <footer className="bg-white border-t border-neutral-200 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-neutral-500">
          © {new Date().getFullYear()} Smart Notes. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
