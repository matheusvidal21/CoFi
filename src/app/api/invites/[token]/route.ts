import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { z } from "zod"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params

  const invite = await prisma.invite.findUnique({
    where: { token },
    include: {
      sender: {
        select: { name: true, email: true }
      }
    }
  })

  if (!invite) {
    return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 })
  }

  if (invite.status !== "PENDING") {
    return NextResponse.json({ error: "Este convite já foi respondido ou expirou" }, { status: 410 })
  }

  if (new Date() > invite.expiresAt) {
    return NextResponse.json({ error: "Este convite expirou" }, { status: 410 })
  }

  return NextResponse.json(invite)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const session = await auth()
  const { token } = await params

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Necessário estar logado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const action = body.action // 'accept' | 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: "Ação inválida" }, { status: 400 })
    }

    const invite = await prisma.invite.findUnique({
      where: { token },
      include: { sender: true }
    })

    if (!invite || invite.status !== "PENDING" || new Date() > invite.expiresAt) {
      return NextResponse.json({ error: "Convite inválido ou expirado" }, { status: 400 })
    }

    if (action === 'reject') {
      await prisma.invite.update({
        where: { id: invite.id },
        data: { 
          status: "REJECTED",
          respondedAt: new Date(),
          receiverId: session.user.id // Link to the user who rejected
        }
      })
      return NextResponse.json({ message: "Convite rejeitado" })
    }

    // Accept logic
    // 1. Create SharedGroup
    // 2. Add sender and receiver as members
    // 3. Update invite status

    // Transaction to ensure consistency
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create Group
      const group = await tx.sharedGroup.create({
        data: {
          name: `Grupo de ${invite.sender.name} e ${session.user.name}`,
          status: "ACTIVE",
        }
      })

      // Add Sender
      await tx.sharedGroupMember.create({
        data: {
          userId: invite.senderId,
          groupId: group.id,
          divisionPercent: 50, // Default 50/50
        }
      })

      // Add Receiver (Current User)
      await tx.sharedGroupMember.create({
        data: {
          userId: session.user.id!,
          groupId: group.id,
          divisionPercent: 50,
        }
      })

      // Update Invite
      await tx.invite.update({
        where: { id: invite.id },
        data: {
          status: "ACCEPTED",
          respondedAt: new Date(),
          receiverId: session.user.id
        }
      })

      return group
    })

    return NextResponse.json({ message: "Convite aceito", groupId: result.id })

  } catch (error) {
    console.error("Invite processing error:", error)
    return NextResponse.json(
      { error: "Erro ao processar convite" },
      { status: 500 }
    )
  }
}
