"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-100/50 dark:hover:bg-red-900/20"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  )
}
