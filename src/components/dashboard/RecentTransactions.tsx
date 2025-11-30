"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react"

interface Transaction {
  id: string
  amount: number
  type: "INCOME" | "EXPENSE"
  category: string
  description: string
  date: string
  user?: {
    name: string
  }
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  showUser?: boolean
}

export default function RecentTransactions({ transactions, showUser = false }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground text-sm">
        Nenhuma transação registrada ainda.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
              transaction.type === "INCOME" 
                ? "bg-green-500/10 text-green-600 dark:bg-green-500/20" 
                : "bg-red-500/10 text-red-600 dark:bg-red-500/20"
            }`}>
              {transaction.type === "INCOME" ? (
                <ArrowUpCircle className="h-4 w-4" />
              ) : (
                <ArrowDownCircle className="h-4 w-4" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">{transaction.description}</p>
                {showUser && transaction.user && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    • {transaction.user.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-muted-foreground">{transaction.category}</p>
                <span className="text-xs text-muted-foreground">•</span>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(transaction.date), "dd MMM", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>

          <div className={`text-sm font-semibold whitespace-nowrap ml-4 ${
            transaction.type === "INCOME" ? "text-green-600" : "text-red-600"
          }`}>
            {transaction.type === "INCOME" ? "+" : "-"} R$ {Number(transaction.amount).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}
