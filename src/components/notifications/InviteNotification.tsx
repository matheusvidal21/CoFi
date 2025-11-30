"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface InviteNotificationProps {
  notificationId: string
  inviteToken: string
  onResponse: () => void
}

export default function InviteNotification({ 
  notificationId, 
  inviteToken,
  onResponse 
}: InviteNotificationProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleInviteAction = async (action: 'accept' | 'reject') => {
    setIsLoading(true)

    try {
      // Process the invite
      const inviteResponse = await fetch(`/api/invites/${inviteToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      const inviteData = await inviteResponse.json()

      if (!inviteResponse.ok) {
        throw new Error(inviteData.error || "Erro ao processar convite")
      }

      // Mark notification as read
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notificationId }),
      })

      if (action === 'accept') {
        toast.success("Convite aceito! Redirecionando para o grupo...")
        setTimeout(() => {
          window.location.href = "/shared-group"
        }, 1500)
      } else {
        toast.success("Convite rejeitado")
        onResponse()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao processar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2 mt-3">
      <Button
        size="sm"
        onClick={() => handleInviteAction('accept')}
        disabled={isLoading}
        className="flex-1"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Check className="h-4 w-4 mr-1" />
            Aceitar
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleInviteAction('reject')}
        disabled={isLoading}
        className="flex-1"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <X className="h-4 w-4 mr-1" />
            Recusar
          </>
        )}
      </Button>
    </div>
  )
}
