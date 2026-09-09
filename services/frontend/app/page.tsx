"use client"

import { useAuth } from "@/contexts/auth-context"
import { LoginPage } from "@/components/login-page"
import { Dashboard } from "@/components/dashboard"
import { NotificationProvider } from "@/components/notification-provider"
import { ApiProvider } from "@/contexts/api-context"

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <NotificationProvider>
      <ApiProvider>
        <div className="min-h-screen bg-background">{isAuthenticated ? <Dashboard /> : <LoginPage />}</div>
      </ApiProvider>
    </NotificationProvider>
  )
}
