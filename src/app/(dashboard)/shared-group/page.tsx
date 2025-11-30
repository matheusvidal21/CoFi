import InviteForm from "@/components/shared-group/InviteForm"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Users, UserPlus } from "lucide-react"

export default async function SharedGroupPage() {
  const session = await auth()
  
  // Fetch user's group
  const membership = await prisma.sharedGroupMember.findFirst({
    where: { userId: session?.user?.id },
    include: {
      group: {
        include: {
          members: {
            include: {
              user: {
                select: { name: true, email: true, monthlyIncome: true }
              }
            }
          }
        }
      }
    }
  })

  const group = membership?.group

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Grupo Compartilhado</h2>
        <p className="text-muted-foreground">
          Gerencie quem divide as contas com você.
        </p>
      </div>

      {!group ? (
        <div className="glass-card p-8 rounded-xl text-center space-y-6 max-w-2xl mx-auto mt-10">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
            <Users className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Você ainda não tem um grupo</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Convide alguém para começar a dividir despesas e ter visibilidade total das finanças compartilhadas.
            </p>
          </div>
          
          <div className="max-w-md mx-auto text-left pt-4 border-t border-border/50">
            <InviteForm />
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-card p-6 rounded-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Membros do Grupo
              </h3>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {group.status}
              </span>
            </div>

            <div className="space-y-4">
              {group.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-medium">
                      {member.user.name[0]}
                    </div>
                    <div>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-xs text-muted-foreground">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{Number(member.divisionPercent)}%</p>
                    <p className="text-xs text-muted-foreground">Divisão</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl space-y-6">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Convidar Novo Membro
            </h3>
            <p className="text-sm text-muted-foreground">
              Envie um convite por email para adicionar mais pessoas ao seu grupo.
            </p>
            <InviteForm />
          </div>
        </div>
      )}
    </div>
  )
}
