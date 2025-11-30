"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PersonalView from "@/components/dashboard/PersonalView"
import SharedView from "@/components/dashboard/SharedView"
import { auth } from "@/lib/auth"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral das suas finanças.
          </p>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <Tabs defaultValue="personal" className="w-full">
          <div className="flex items-center justify-center mb-6">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="personal">Minhas Finanças</TabsTrigger>
              <TabsTrigger value="shared">Finanças em Conjunto</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="personal" className="space-y-4">
            <PersonalView />
          </TabsContent>
          
          <TabsContent value="shared" className="space-y-4">
            <SharedView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
