import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { randomUUID } from "crypto"
import { addDays } from "date-fns"

const sendInviteSchema = z.object({
  email: z.string().email("Email inválido"),
})

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.email || !session.user.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = sendInviteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      )
    }

    const { email: receiverEmail } = result.data

    if (receiverEmail === session.user.email) {
      return NextResponse.json(
        { error: "Você não pode convidar a si mesmo" },
        { status: 400 }
      )
    }

    // Check if receiver exists in the system
    const receiverUser = await prisma.user.findUnique({
      where: { email: receiverEmail },
    })

    if (!receiverUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado no sistema. Eles precisam criar uma conta primeiro." },
        { status: 404 }
      )
    }

    // Check if receiver already has a group
    const receiverMembership = await prisma.sharedGroupMember.findFirst({
      where: { userId: receiverUser.id },
    })

    if (receiverMembership) {
      return NextResponse.json(
        { error: "Este usuário já faz parte de um grupo compartilhado" },
        { status: 400 }
      )
    }

    // Check if user already has a group (MVP limitation: 1 group)
    const existingMembership = await prisma.sharedGroupMember.findFirst({
      where: { userId: session.user.id },
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: "Você já faz parte de um grupo compartilhado" },
        { status: 400 }
      )
    }

    // Auto-cleanup expired invites before checking for duplicates
    await prisma.invite.updateMany({
      where: {
        status: "PENDING",
        expiresAt: {
          lt: new Date()
        }
      },
      data: {
        status: "EXPIRED"
      }
    })

    // Check for pending invites to same person
    const existingInvite = await prisma.invite.findFirst({
      where: {
        senderId: session.user.id,
        receiverEmail,
        status: "PENDING",
      },
    })

    if (existingInvite) {
      console.log(`[INVITE] Pending invite already exists from ${session.user.email} to ${receiverEmail}`)
      return NextResponse.json(
        { error: `Já existe um convite pendente para ${receiverEmail}. Aguarde a resposta ou cancele o convite anterior.` },
        { status: 409 }
      )
    }

    // Get sender user info
    const senderUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true }
    })

    // Create invite
    const token = randomUUID()
    const expiresAt = addDays(new Date(), 7) // 7 days

    await prisma.invite.create({
      data: {
        token,
        senderEmail: session.user.email,
        receiverEmail,
        senderId: session.user.id,
        receiverId: receiverUser.id,
        expiresAt,
      },
    })

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverUser.id,
        title: "Novo convite para grupo",
        message: `${senderUser?.name || session.user.email} te convidou para participar de um grupo compartilhado. Token: ${token}`,
      }
    })

    return NextResponse.json({ 
      message: "Convite enviado com sucesso!", 
      inviteToken: token
    })
  } catch (error) {
    console.error("Send invite error:", error)
    return NextResponse.json(
      { error: "Erro ao enviar convite" },
      { status: 500 }
    )
  }
}
