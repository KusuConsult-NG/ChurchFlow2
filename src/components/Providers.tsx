'use client'

import { AuthProvider } from "@/context/AuthContext"
import { ToastProvider } from "@/components/ui/toast"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import { AuthGuard } from "@/components/AuthGuard"
import { usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname()
  
  // Define public routes that don't need authentication
  const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/auth/reset-password', '/auth/two-factor']
  const isPublicRoute = publicRoutes.includes(pathname)

  return (
    <SessionProvider>
      <ToastProvider>
        <AuthProvider>
          {isPublicRoute ? (
            // Render public pages without dashboard layout
            children
          ) : (
            // Render dashboard layout for authenticated pages
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6">
                  <AuthGuard>
                    {children}
                  </AuthGuard>
                </main>
              </div>
            </div>
          )}
        </AuthProvider>
      </ToastProvider>
    </SessionProvider>
  )
}
