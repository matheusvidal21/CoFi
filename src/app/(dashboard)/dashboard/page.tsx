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

      <div className="space-y-6">
        <Tabs defaultValue="personal" className="w-full space-y-6">
          <div className="flex items-center justify-between">
             <div className="bg-muted/20 p-1 rounded-xl inline-flex">
              <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-transparent">
                <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Minhas Finanças</TabsTrigger>
                <TabsTrigger value="shared" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">Finanças em Conjunto</TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <TabsContent value="personal" className="space-y-4 outline-none mt-0">
            <PersonalView />
          </TabsContent>
          
          <TabsContent value="shared" className="space-y-4 outline-none mt-0">
            <SharedView />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
