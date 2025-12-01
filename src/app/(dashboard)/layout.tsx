import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Settings,
  Sparkles
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col md:flex-row">
      {/* Mobile Navigation (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-border/30 flex justify-around py-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Link href="/dashboard" className="flex flex-col items-center text-xs gap-1 text-muted-foreground hover:text-primary transition-colors">
          <div className="h-10 w-10 rounded-xl bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="font-medium">Início</span>
        </Link>
        <Link href="/transactions" className="flex flex-col items-center text-xs gap-1 text-muted-foreground hover:text-primary transition-colors">
          <div className="h-10 w-10 rounded-xl bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors">
            <CreditCard className="h-5 w-5" />
          </div>
          <span className="font-medium">Transações</span>
        </Link>
        <Link href="/shared-group" className="flex flex-col items-center text-xs gap-1 text-muted-foreground hover:text-primary transition-colors">
          <div className="h-10 w-10 rounded-xl bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors">
            <Users className="h-5 w-5" />
          </div>
          <span className="font-medium">Grupo</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center text-xs gap-1 text-muted-foreground hover:text-primary transition-colors">
          <div className="h-10 w-10 rounded-xl bg-primary/5 hover:bg-primary/10 flex items-center justify-center transition-colors">
            <Settings className="h-5 w-5" />
          </div>
          <span className="font-medium">Ajustes</span>
        </Link>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-border/30 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl sticky top-0 h-screen p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CoFinance</span>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-base font-medium hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Button>
          </Link>
          <Link href="/transactions">
            <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-base font-medium hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <CreditCard className="h-5 w-5" />
              Transações
            </Button>
          </Link>
          <Link href="/shared-group">
            <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-base font-medium hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <Users className="h-5 w-5" />
              Grupo Compartilhado
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-base font-medium hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <Settings className="h-5 w-5" />
              Configurações
            </Button>
          </Link>
        </nav>

        <div className="pt-6 border-t border-border/30 shrink-0">
          <div className="flex items-center justify-between mb-4 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold text-primary shadow-sm">
                {session.user.name?.[0] || "U"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-foreground">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">Conta pessoal</p>
              </div>
            </div>
            <Notifications />
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 pb-28 md:pb-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}