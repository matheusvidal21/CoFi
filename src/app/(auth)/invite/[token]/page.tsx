"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, Check, X } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface InviteDetails {
  id: string
  sender: {
    name: string
    email: string
  }
  expiresAt: string
}

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const [invite, setInvite] = useState<InviteDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInvite() {
      try {
        const response = await fetch(`/api/invites/${token}`)
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Convite inválido")
        }
        const data = await response.json()
        setInvite(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar convite")
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchInvite()
    }
  }, [token])

  async function handleAction(action: 'accept' | 'reject') {
    setIsProcessing(true)
    try {
      const response = await fetch(`/api/invites/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar convite")
      }

      if (action === 'accept') {
        toast.success("Convite aceito com sucesso!")
        router.push("/dashboard")
      } else {
        toast.info("Convite rejeitado")
        router.push("/dashboard")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao processar")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="glass p-8 rounded-xl max-w-md w-full text-center space-y-4">
          <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto text-red-500">
            <X className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">Convite Inválido</h1>
          <p className="text-muted-foreground">{error}</p>
          <Link href="/dashboard">
            <Button variant="outline" className="mt-4">Ir para Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-4">
      <div className="glass p-8 rounded-xl max-w-md w-full space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Convite para Grupo</h1>
          <p className="text-muted-foreground">
            Você foi convidado para dividir finanças
          </p>
        </div>

        <div className="py-6 border-y border-border/50">
          <p className="text-sm text-muted-foreground mb-2">Convidado por</p>
          <p className="text-lg font-medium">{invite?.sender.name}</p>
          <p className="text-sm text-muted-foreground">{invite?.sender.email}</p>
        </div>

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1 border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/50 dark:hover:bg-red-900/20"
            onClick={() => handleAction('reject')}
            disabled={isProcessing}
          >
            Rejeitar
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => handleAction('accept')}
            disabled={isProcessing}
          >
            {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aceitar"}
          </Button>
        </div>
      </div>
    </div>
  )
}
