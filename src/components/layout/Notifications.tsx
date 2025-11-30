"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import InviteNotification from "@/components/notifications/InviteNotification"

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
        setUnreadCount(data.length) // API returns only unread by default
      }
    } catch (error) {
      console.error("Failed to fetch notifications")
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  const markAsRead = async (notificationId?: string) => {
    try {
      await fetch("/api/notifications", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notificationId }) 
      })
      fetchNotifications()
    } catch (error) {
      console.error("Failed to mark as read")
    }
  }

  const markAllAsRead = async () => {
    if (unreadCount === 0) return
    try {
      await fetch("/api/notifications", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}) 
      })
      setNotifications([])
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all as read")
    }
  }

  const extractInviteToken = (message: string) => {
    const match = message.match(/Token: ([a-f0-9-]+)/)
    return match ? match[1] : null
  }

  const extractSenderName = (message: string) => {
    const match = message.match(/^(.+?) te convidou/)
    return match ? match[1] : "Alguém"
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div>
            <h4 className="font-medium leading-none">Notificações</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount === 0 ? 'Nenhuma nova' : `${unreadCount} ${unreadCount === 1 ? 'nova' : 'novas'}`}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Limpar tudo
            </Button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Nenhuma notificação nova.
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {notifications.map((notification) => {
                const isInvite = notification.title.toLowerCase().includes("convite")
                const inviteToken = isInvite ? extractInviteToken(notification.message) : null
                const senderName = isInvite ? extractSenderName(notification.message) : ""

                return (
                  <div key={notification.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between gap-2 mb-1">
                      <h5 className="text-sm font-medium">{notification.title}</h5>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {new Date(notification.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {isInvite 
                        ? `${senderName} te convidou para participar de um grupo compartilhado.`
                        : notification.message
                      }
                    </p>
                    {isInvite && inviteToken ? (
                      <InviteNotification
                        notificationId={notification.id}
                        inviteToken={inviteToken}
                        onResponse={fetchNotifications}
                      />
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Marcar como lida
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
