import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "@/components/dashboard/SignOutButton"
import { Notifications } from "@/components/layout/Notifications"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Navigation (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 flex justify-around p-4">
        <Link href="/dashboard" className="flex flex-col items-center text-xs gap-1 text-muted-foreground hover:text-primary">
          <LayoutDashboard className="h-5 w-5" />
          <span>Início</span>
        </Link>
        <Link href="/transactions" className="flex flex-col items-center text-xs gap-1 text-muted-foreground hover:text-primary">
          <CreditCard className="h-5 w-5" />
          <span>Transações</span>
        </Link>
        <Link href="/shared-group" className="flex flex-col items-center text-xs gap-1 text-muted-foreground hover:text-primary">
          <Users className="h-5 w-5" />
          <span>Grupo</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center text-xs gap-1 text-muted-foreground hover:text-primary">
          <Settings className="h-5 w-5" />
          <span>Ajustes</span>
        </Link>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border/50 glass-card min-h-screen p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-bold text-primary">C</span>
          </div>
          <span className="text-xl font-bold tracking-tight">CoFi</span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/transactions">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <CreditCard className="h-4 w-4" />
              Transações
            </Button>
          </Link>
          <Link href="/shared-group">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Users className="h-4 w-4" />
              Grupo Compartilhado
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </Link>
        </nav>

        <div className="pt-6 border-t border-border/50">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">
                {session.user.name?.[0] || "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{session.user.name}</p>
              </div>
            </div>
            <Notifications />
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-24 md:pb-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
