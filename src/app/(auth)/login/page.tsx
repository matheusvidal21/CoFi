import { Suspense } from "react"
import LoginForm from "@/components/auth/LoginForm"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">CoFi</h1>
          <p className="mt-2 text-muted-foreground">
            Bem-vindo de volta
          </p>
        </div>

        <div className="glass p-8 rounded-xl">
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Acesse sua conta</h2>
            <p className="text-sm text-muted-foreground">
              Entre com suas credenciais
            </p>
          </div>
          
          <Suspense fallback={<div>Carregando...</div>}>
            <LoginForm />
          </Suspense>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Não tem uma conta? </span>
            <Link href="/register" className="font-medium text-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
