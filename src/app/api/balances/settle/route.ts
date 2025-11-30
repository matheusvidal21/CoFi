import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const settleBalanceSchema = z.object({
  creditorId: z.string(), // User who is owed money (toUserId)
})

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = settleBalanceSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      )
    }

    const { creditorId } = result.data
    const debtorId = session.user.id

    // Verify both users are in the same group
    const debtorMembership = await prisma.sharedGroupMember.findFirst({
      where: { userId: debtorId },
    })

    const creditorMembership = await prisma.sharedGroupMember.findFirst({
      where: { userId: creditorId },
    })

    if (!debtorMembership || !creditorMembership) {
      return NextResponse.json(
        { error: "Usuários não estão em grupos" },
        { status: 400 }
      )
    }

    if (debtorMembership.groupId !== creditorMembership.groupId) {
      return NextResponse.json(
        { error: "Usuários não estão no mesmo grupo" },
        { status: 403 }
      )
    }

    // Find all unpaid divisions in BOTH directions for proper netting
    
    // Direction 1: Debtor owes Creditor
    // (divisions where debtor is the one who needs to pay, and creditor paid the transaction)
    const debtorOwesCreditor = await prisma.transactionDivision.findMany({
      where: {
        userId: debtorId,
        isPaid: false,
        transaction: {
          userId: creditorId,
          groupId: debtorMembership.groupId,
        }
      },
    })

    // Direction 2: Creditor owes Debtor
    // (divisions where creditor is the one who needs to pay, and debtor paid the transaction)
    const creditorOwesDebtor = await prisma.transactionDivision.findMany({
      where: {
        userId: creditorId,
        isPaid: false,
        transaction: {
          userId: debtorId,
          groupId: debtorMembership.groupId,
        }
      },
    })

    // Calculate net amounts
    const debtorOwesAmount = debtorOwesCreditor.reduce(
      (sum, div) => sum + Number(div.amount),
      0
    )
    
    const creditorOwesAmount = creditorOwesDebtor.reduce(
      (sum, div) => sum + Number(div.amount),
      0
    )

    // Calculate net balance
    const netBalance = debtorOwesAmount - creditorOwesAmount

    if (Math.abs(netBalance) < 0.01) {
      return NextResponse.json(
        { error: "Não há saldo pendente entre vocês" },
        { status: 400 }
      )
    }

    // Mark ALL divisions in BOTH directions as paid
    // This is the key fix: we settle everything between these two users
    const allDivisionIds = [
      ...debtorOwesCreditor.map(d => d.id),
      ...creditorOwesDebtor.map(d => d.id)
    ]

    if (allDivisionIds.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma divisão pendente encontrada" },
        { status: 404 }
      )
    }

    await prisma.transactionDivision.updateMany({
      where: {
        id: { in: allDivisionIds }
      },
      data: {
        isPaid: true,
        paidAt: new Date()
      }
    })

    // Get creditor's name for transaction description
    const creditor = await prisma.user.findUnique({
      where: { id: creditorId },
      select: { name: true }
    })

    // Create a personal expense transaction for the debtor
    // This records the payment in their personal finances
    await prisma.transaction.create({
      data: {
        userId: debtorId,
        amount: Math.abs(netBalance),
        type: "EXPENSE",
        category: "Pagamento de Dívida",
        description: `Pagamento para ${creditor?.name || 'parceiro'} - Dívidas compartilhadas`,
        date: new Date(),
        isShared: false,
        isRecurring: false,
      }
    })

    // Log for debugging
    console.log(`[SETTLE] Settlement between ${debtorId} and ${creditorId}:`)
    console.log(`[SETTLE] - Debtor owed: R$ ${debtorOwesAmount.toFixed(2)}`)
    console.log(`[SETTLE] - Creditor owed: R$ ${creditorOwesAmount.toFixed(2)}`)
    console.log(`[SETTLE] - Net balance: R$ ${Math.abs(netBalance).toFixed(2)} (${netBalance > 0 ? 'debtor pays' : 'creditor pays'})`)
    console.log(`[SETTLE] - Total divisions settled: ${allDivisionIds.length}`)
    console.log(`[SETTLE] - Personal expense created: R$ ${Math.abs(netBalance).toFixed(2)}`)

    return NextResponse.json({
      message: "Pagamento registrado com sucesso!",
      totalAmount: Math.abs(netBalance),
      debtorOwed: debtorOwesAmount,
      creditorOwed: creditorOwesAmount,
      netSettlement: netBalance,
      divisionsSettled: allDivisionIds.length
    })
  } catch (error) {
    console.error("Settle balance error:", error)
    return NextResponse.json(
      { error: "Erro ao registrar pagamento" },
      { status: 500 }
    )
  }
}
