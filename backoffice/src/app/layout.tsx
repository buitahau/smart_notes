import './globals.css'
import { Inter } from 'next/font/google'
import { AdminAuthProvider } from '@/lib/auth/admin-context'
import { ChakraProvider } from '@chakra-ui/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Smart Notes - AI-Powered Chrome Extension',
  description: 'Transform your note-taking and task management with AI-powered insights and unified chat interface.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ChakraProvider>
          <AdminAuthProvider>
            {children}
          </AdminAuthProvider>
        </ChakraProvider>
      </body>
    </html>
  )
}