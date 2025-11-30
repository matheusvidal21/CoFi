import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { calculateDivisions } from "@/lib/calculations"

const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string(),
  description: z.string(),
  date: z.string().transform(str => new Date(str)),
  isShared: z.boolean().default(false),
  divisionType: z.enum(["EQUAL", "CUSTOM", "INCOME_BASED"]).optional(),
  customDivisions: z.array(z.object({
    userId: z.string(),
    percentage: z.number()
  })).optional()
})

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = transactionSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { amount, type, category, description, date, isShared, divisionType } = result.data

    let groupId = null
    let divisionsData: any[] = []

    if (isShared) {
      // Get user's group
      const membership = await prisma.sharedGroupMember.findFirst({
        where: { userId: session.user.id },
        include: { group: { include: { members: true } } }
      })

      if (!membership) {
        return NextResponse.json(
          { error: "Você não faz parte de um grupo para criar transações compartilhadas" },
          { status: 400 }
        )
      }

      groupId = membership.groupId
      const members = membership.group.members.map(m => ({
        userId: m.userId,
        divisionPercent: Number(m.divisionPercent)
      }))

      // Calculate divisions
      const calculatedDivisions = calculateDivisions(amount, members)
      
      divisionsData = calculatedDivisions.map(div => ({
        userId: div.userId,
        amount: div.amount,
        percentage: div.percentage,
        isPaid: div.userId === session.user.id, // Payer is considered "paid" (or handled differently in logic)
        // Actually, for expense: Payer paid full amount. Others owe payer.
        // Division record tracks "who is responsible for what portion".
        // If I paid 100, and split 50/50:
        // Me: 50 (My share)
        // You: 50 (Your share) -> You owe me 50.
      }))
    }

    // Create Transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        groupId,
        amount,
        type,
        category,
        description,
        date,
        isShared,
        divisionType: divisionType || (isShared ? "EQUAL" : null),
        divisions: {
          create: divisionsData
        }
      },
      include: {
        divisions: true
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Transaction creation error:", error)
    return NextResponse.json(
      { error: "Erro ao criar transação" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const session = await auth()
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") // 'personal' | 'shared' | 'all'
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const where: any = {
      OR: [
        { userId: session.user.id }, // Created by me
      ]
    }

    if (type === 'shared') {
      // Get my group
      const membership = await prisma.sharedGroupMember.findFirst({
        where: { userId: session.user.id }
      })
      
      if (membership) {
        where.OR.push({ groupId: membership.groupId }) // Or belongs to my group
        where.isShared = true
      } else {
        return NextResponse.json([]) // No group, no shared transactions
      }
    } else if (type === 'personal') {
      where.isShared = false
      where.userId = session.user.id
    } else {
      // All: Personal + Shared (if in group)
      const membership = await prisma.sharedGroupMember.findFirst({
        where: { userId: session.user.id }
      })
      if (membership) {
        where.OR.push({ groupId: membership.groupId })
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        user: { select: { name: true } },
        divisions: true
      },
      take: 50 // Limit for MVP
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Transactions fetch error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar transações" },
      { status: 500 }
    )
  }
}
