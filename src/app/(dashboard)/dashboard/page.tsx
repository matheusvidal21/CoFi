"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PersonalView from "@/components/dashboard/PersonalView"
import SharedView from "@/components/dashboard/SharedView"
import { User, Users } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Visão geral das suas finanças pessoais e compartilhadas.
          </p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl">
        <Tabs defaultValue="personal" className="w-full">
          <div className="flex items-center justify-center mb-8">
            <TabsList className="grid w-full max-w-[440px] grid-cols-2">
              <TabsTrigger value="personal" className="gap-2">
                <User className="h-4 w-4" />
                Pessoal
              </TabsTrigger>
              <TabsTrigger value="shared" className="gap-2">
                <Users className="h-4 w-4" />
                Conjunto
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="personal" className="space-y-6 mt-0">
            <PersonalView />
          </TabsContent>
          
          <TabsContent value="shared" className="space-y-6 mt-0">
            <SharedView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}