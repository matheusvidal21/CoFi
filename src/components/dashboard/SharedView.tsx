"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownCircle, ArrowUpCircle, Wallet, Users } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import PendingBalances from "@/components/dashboard/PendingBalances"
import RecentTransactions from "@/components/dashboard/RecentTransactions"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface SharedDashboardData {
  hasGroup: boolean
  groupName?: string
  summary?: {
    income: number
    expense: number
    balance: number
  }
  categories?: { name: string; value: number }[]
  pendingBalances?: any[]
  recentTransactions?: any[]
}

export default function SharedView() {
  const [data, setData] = useState<SharedDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = () => {
    setIsLoading(true)
    fetch("/api/dashboard/shared")
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) return <div className="py-10 text-center">Carregando...</div>
  if (!data) return <div className="py-10 text-center">Erro ao carregar dados</div>

  if (!data.hasGroup) {
    return (
      <div className="glass-card p-10 text-center space-y-6">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
          <Users className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Sem grupo compartilhado</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Crie ou entre em um grupo para visualizar as finanças compartilhadas.
          </p>
        </div>
        <Link href="/shared-group">
          <Button>Ir para Grupo</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-muted-foreground">
          {data.groupName}
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Grupo</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {data.summary?.income.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Grupo</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {data.summary?.expense.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo do Grupo</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {data.summary?.balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Pendências Financeiras</CardTitle>
          </CardHeader>
          <CardContent>
            <PendingBalances balances={data.pendingBalances || []} onSettled={fetchData} />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Gastos Compartilhados por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {data.categories && data.categories.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.categories}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Sem dados de despesas este mês
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Transações Recentes do Grupo</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentTransactions 
            transactions={data.recentTransactions || []} 
            showUser={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}
