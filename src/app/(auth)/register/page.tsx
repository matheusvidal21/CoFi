import RegisterForm from "@/components/auth/RegisterForm"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">CoFi</h1>
          <p className="mt-2 text-muted-foreground">
            Gestão financeira compartilhada, simples e transparente.
          </p>
        </div>

        <div className="glass p-8 rounded-xl">
          <div className="flex flex-col space-y-2 text-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Crie sua conta</h2>
            <p className="text-sm text-muted-foreground">
              Comece a organizar suas finanças hoje
            </p>
          </div>
          
          <RegisterForm />
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Já tem uma conta? </span>
            <Link href="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
