import { Suspense } from "react"
import LoginForm from "@/components/auth/LoginForm"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 dark:from-primary/20 dark:via-secondary/20 dark:to-accent/20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">CoFinance</h1>
          <p className="mt-2 text-muted-foreground">
            Bem-vindo de volta
          </p>
        </div>

        <div className="glass p-8 rounded-2xl shadow-[var(--shadow-card)]">
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Acesse sua conta</h2>
            <p className="text-sm text-muted-foreground">
              Entre com suas credenciais
            </p>
          </div>
          
          <Suspense fallback={<div className="py-4 text-center"><div className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-primary border-t-transparent"></div></div>}>
            <LoginForm />
          </Suspense>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <Link href="/register" className="font-semibold text-primary hover:text-secondary transition-colors">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}