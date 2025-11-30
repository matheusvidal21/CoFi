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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-muted-foreground">
          {data.groupName}
        </h3>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <ArrowUpCircle className="w-24 h-24 text-green-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas do Grupo</CardTitle>
            <ArrowUpCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-3xl font-bold text-green-600">
              R$ {data.summary?.income.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-l-4 border-l-red-500">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <ArrowDownCircle className="w-24 h-24 text-red-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas do Grupo</CardTitle>
            <ArrowDownCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-3xl font-bold text-red-600">
              R$ {data.summary?.expense.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-l-4 border-l-primary">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Wallet className="w-24 h-24 text-primary" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo do Grupo</CardTitle>
            <Wallet className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="z-10">
            <div className={`text-3xl font-bold ${data.summary?.balance >= 0 ? 'text-primary' : 'text-red-600'}`}>
              R$ {data.summary?.balance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-primary flex items-center gap-2">
              <Users className="w-5 h-5" />
              Pendências Financeiras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PendingBalances balances={data.pendingBalances || []} onSettled={fetchData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gastos Compartilhados por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {data.categories && data.categories.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.categories} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      stroke="#718096" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#718096" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `R$${value}`} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(102, 126, 234, 0.1)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="url(#sharedColorGradient)" 
                      radius={[6, 6, 0, 0]} 
                      className="fill-primary"
                      barSize={40}
                    />
                    <defs>
                      <linearGradient id="sharedColorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#667eea" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#764ba2" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                   <div className="p-4 rounded-full bg-muted/50">
                    <BarChart className="w-8 h-8 opacity-50" />
                  </div>
                  <p>Sem dados de despesas este mês</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
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
