"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email().optional(), // Read-only
  monthlyIncome: z.string().optional(),
})

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      monthlyIncome: "",
    },
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/users/profile")
        if (response.ok) {
          const data = await response.json()
          form.reset({
            name: data.name,
            email: data.email,
            monthlyIncome: data.monthlyIncome ? String(data.monthlyIncome) : "",
          })
        }
      } catch (error) {
        toast.error("Erro ao carregar perfil")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSaving(true)

    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          monthlyIncome: values.monthlyIncome ? parseFloat(values.monthlyIncome) : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil")
      }

      toast.success("Perfil atualizado com sucesso")
      // Refresh session/page might be needed to update sidebar name immediately
      // router.refresh()
    } catch (err) {
      toast.error("Erro ao salvar alterações")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-muted" />
              </FormControl>
              <FormDescription>
                O email não pode ser alterado.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} className="bg-white/50 dark:bg-black/20" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monthlyIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Renda Mensal</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} className="bg-white/50 dark:bg-black/20" />
              </FormControl>
              <FormDescription>
                Usado para cálculos de divisão proporcional (opcional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Alterações"
          )}
        </Button>
      </form>
    </Form>
  )
}
