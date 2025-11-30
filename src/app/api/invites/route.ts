import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    // Get all pending invites sent by this user
    const sentInvites = await prisma.invite.findMany({
      where: {
        senderId: session.user.id,
        status: "PENDING",
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        receiverEmail: true,
        createdAt: true,
        expiresAt: true,
      }
    })

    // Get all pending invites received by this user
    const receivedInvites = await prisma.invite.findMany({
      where: {
        receiverId: session.user.id,
        status: "PENDING",
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        token: true,
        senderEmail: true,
        createdAt: true,
        expiresAt: true,
        sender: {
          select: {
            name: true,
          }
        }
      }
    })

    return NextResponse.json({ 
      sentInvites,
      receivedInvites
    })
  } catch (error) {
    console.error("List invites error:", error)
    return NextResponse.json(
      { error: "Erro ao listar convites" },
      { status: 500 }
    )
  }
}
