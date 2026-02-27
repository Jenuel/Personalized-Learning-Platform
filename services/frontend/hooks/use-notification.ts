"use client"

import { useState, useCallback } from "react"

export interface Notification {
  id: string
  title: string
  description?: string
  type: "success" | "error" | "info" | "warning"
}

let notificationId = 0

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = (++notificationId).toString()
    const newNotification = { ...notification, id }

    setNotifications((prev) => [...prev, newNotification])

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)

    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const success = useCallback(
    (title: string, description?: string) => {
      return addNotification({ title, description, type: "success" })
    },
    [addNotification],
  )

  const error = useCallback(
    (title: string, description?: string) => {
      return addNotification({ title, description, type: "error" })
    },
    [addNotification],
  )

  const info = useCallback(
    (title: string, description?: string) => {
      return addNotification({ title, description, type: "info" })
    },
    [addNotification],
  )

  const warning = useCallback(
    (title: string, description?: string) => {
      return addNotification({ title, description, type: "warning" })
    },
    [addNotification],
  )

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  }
}
