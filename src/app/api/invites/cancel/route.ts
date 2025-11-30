import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { inviteId } = body

    if (!inviteId) {
      return NextResponse.json(
        { error: "ID do convite é obrigatório" },
        { status: 400 }
      )
    }

    // Find the invite and verify ownership
    const invite = await prisma.invite.findUnique({
      where: { id: inviteId },
    })

    if (!invite) {
      return NextResponse.json(
        { error: "Convite não encontrado" },
        { status: 404 }
      )
    }

    if (invite.senderId !== session.user.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para cancelar este convite" },
        { status: 403 }
      )
    }

    if (invite.status !== "PENDING") {
      return NextResponse.json(
        { error: "Apenas convites pendentes podem ser cancelados" },
        { status: 400 }
      )
    }

    // Update invite status to REJECTED (cancelled by sender)
    await prisma.invite.update({
      where: { id: inviteId },
      data: { 
        status: "REJECTED",
        respondedAt: new Date()
      }
    })

    return NextResponse.json({ 
      message: "Convite cancelado com sucesso" 
    })
  } catch (error) {
    console.error("Cancel invite error:", error)
    return NextResponse.json(
      { error: "Erro ao cancelar convite" },
      { status: 500 }
    )
  }
}
