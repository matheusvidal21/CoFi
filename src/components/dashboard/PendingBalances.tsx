"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface PendingBalance {
  from: string
  to: string
  amount: number
  isUserDebtor: boolean
  isUserCreditor: boolean
  fromUserId?: string
  toUserId?: string
}

interface PendingBalancesProps {
  balances: PendingBalance[]
  onSettled?: () => void
}

export default function PendingBalances({ balances, onSettled }: PendingBalancesProps) {
  const [processingId, setProcessingId] = useState<string | null>(null)

  if (balances.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        Nenhuma pendência financeira no momento.
      </div>
    )
  }

  const handleSettle = async (balance: PendingBalance) => {
    if (!balance.toUserId) {
      toast.error("Erro: ID do credor não encontrado")
      return
    }

    const settlementKey = `${balance.fromUserId}-${balance.toUserId}`
    setProcessingId(settlementKey)

    try {
      const response = await fetch("/api/balances/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creditorId: balance.toUserId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao registrar pagamento")
      }

      toast.success(`Pagamento de R$ ${data.totalAmount.toFixed(2)} registrado com sucesso!`)
      
      // Call callback to refresh data without full page reload
      if (onSettled) {
        setTimeout(() => {
          onSettled()
        }, 800)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao processar pagamento")
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-3">
      {balances.map((balance, index) => {
        const settlementKey = `${balance.fromUserId}-${balance.toUserId}`
        const isProcessing = processingId === settlementKey

        return (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{balance.from}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">{balance.to}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="font-bold text-red-500">
                R$ {balance.amount.toFixed(2)}
              </span>
              
              {balance.isUserDebtor && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs gap-1 border-green-200 hover:bg-green-50 hover:text-green-600 dark:border-green-900/50 dark:hover:bg-green-900/20"
                  onClick={() => handleSettle(balance)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3 w-3" />
                      Pagar
                    </>
                  )}
                </Button>
              )}
              
              {balance.isUserCreditor && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-xs gap-1 text-muted-foreground"
                  disabled
                >
                  A receber
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
