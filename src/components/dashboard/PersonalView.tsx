"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownCircle, ArrowUpCircle, Wallet, Users } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import RecentTransactions from "./RecentTransactions"
import { Button } from "@/components/ui/button"

interface DashboardData {
  summary: {
    income: number
    expense: number
    balance: number
  }
  monthlyIncome?: number
  categories: { name: string; value: number }[]
  recentTransactions?: any[]
}

export default function PersonalView() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard/personal")
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <div className="py-10 text-center">Carregando...</div>
  if (!data) return <div className="py-10 text-center">Erro ao carregar dados</div>

  return (
    <div className="space-y-8">
      {/* Top Cards Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <ArrowUpCircle className="w-24 h-24 text-green-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Receitas (Mês)</CardTitle>
            <ArrowUpCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-3xl font-bold text-green-600">
              R$ {data.summary.income.toFixed(2)}
            </div>
            {data.monthlyIncome && data.monthlyIncome > 0 && (
              <div className="mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground space-y-1.5">
                <div className="flex justify-between items-center">
                  <span>Renda fixa</span>
                  <span className="font-semibold text-foreground/80">R$ {data.monthlyIncome.toFixed(2)}</span>
                </div>
                {(data.summary.income - data.monthlyIncome) > 0 && (
                  <div className="flex justify-between items-center">
                    <span>Variável</span>
                    <span className="font-semibold text-foreground/80">R$ {(data.summary.income - data.monthlyIncome).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-red-500">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <ArrowDownCircle className="w-24 h-24 text-red-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas (Mês)</CardTitle>
            <ArrowDownCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent className="z-10">
            <div className="text-3xl font-bold text-red-600">
              R$ {data.summary.expense.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
             Total de saídas contabilizadas
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-primary">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Wallet className="w-24 h-24 text-primary" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Saldo (Mês)</CardTitle>
            <Wallet className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="z-10">
            <div className={`text-3xl font-bold ${data.summary.balance >= 0 ? 'text-primary' : 'text-red-600'}`}>
              R$ {data.summary.balance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Balanço atual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Charts Section - Spans 2 cols */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {data.categories.length > 0 ? (
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
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        fontFamily: 'var(--font-sans)'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="url(#colorGradient)" 
                      radius={[6, 6, 0, 0]} 
                      className="fill-primary"
                      barSize={40}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
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

        {/* Side Column: Settlements & Recent Transactions */}
        <div className="space-y-6">
           {/* Highlight Section: Acerto de Contas */}
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Users className="w-5 h-5" />
                Acerto de Contas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Verifique suas pendências e realize acertos com seu grupo.
              </p>
              <Button className="w-full" variant="default">
                Ver Pendências
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recentes</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <RecentTransactions transactions={data.recentTransactions || []} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
