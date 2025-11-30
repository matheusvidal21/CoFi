"use client"

import { useState } from "react"
import TransactionList from "@/components/transactions/TransactionList"
import TransactionForm from "@/components/transactions/TransactionForm"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TransactionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = () => {
    setIsDialogOpen(false)
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transações</h2>
          <p className="text-muted-foreground">
            Gerencie suas receitas e despesas.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Nova Transação</DialogTitle>
              <DialogDescription>
                Adicione uma nova receita ou despesa.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="personal">Pessoais</TabsTrigger>
            <TabsTrigger value="shared">Compartilhadas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <TransactionList type="all" refreshTrigger={refreshTrigger} />
          </TabsContent>
          <TabsContent value="personal">
            <TransactionList type="personal" refreshTrigger={refreshTrigger} />
          </TabsContent>
          <TabsContent value="shared">
            <TransactionList type="shared" refreshTrigger={refreshTrigger} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
