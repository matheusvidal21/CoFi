"use client"

import { useState } from "react"
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
} from "@/components/ui/form"
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  email: z.string().email("Email inválido"),
})

export default function InviteForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/invites/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar convite")
      }

      toast.success("Convite enviado com sucesso!")
      form.reset()
      
      if (data.inviteToken) {
        console.log("DEV MODE - Invite Link:", `${window.location.origin}/invite/${data.inviteToken}`)
        toast.info("Link copiado para o console (Modo DEV)")
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4 items-end">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Convidar por Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} className="bg-white/50 dark:bg-black/20" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Enviar
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
