import { Decimal } from "@prisma/client/runtime/library"

export function calculateDivisions(
  amount: number,
  members: { userId: string; divisionPercent: number }[]
): { userId: string; amount: number; percentage: number }[] {
  
  // Simple percentage based division
  const divisions = members.map(member => {
    const share = (amount * member.divisionPercent) / 100
    return {
      userId: member.userId,
      amount: Number(share.toFixed(2)),
      percentage: member.divisionPercent
    }
  })

  // Adjust for rounding errors (add/subtract remainder from first member)
  const totalCalculated = divisions.reduce((sum, div) => sum + div.amount, 0)
  const diff = Number((amount - totalCalculated).toFixed(2))
  
  if (diff !== 0) {
    divisions[0].amount = Number((divisions[0].amount + diff).toFixed(2))
  }

  return divisions
}

export function calculatePendingBalances(
  divisions: { userId: string; amount: number; isPaid: boolean; transaction: { userId: string } }[]
): { fromUserId: string; toUserId: string; amount: number }[] {
  // Map of "User A owes User B" -> Amount
  const debts = new Map<string, number>()

  divisions.forEach(div => {
    if (div.isPaid) return // Already settled

    const payerId = div.transaction.userId // Who paid the original transaction
    const debtorId = div.userId // Who owes their share

    if (payerId === debtorId) return // You don't owe yourself

    const key = `${debtorId}-${payerId}`
    const currentDebt = debts.get(key) || 0
    debts.set(key, currentDebt + Number(div.amount))
  })

  // Resolve mutual debts (if A owes B 100 and B owes A 40 -> A owes B 60)
  // This is a simplified version. For MVP, we just list all debts or simple net.
  // Let's do simple net between pairs.
  
  const result: { fromUserId: string; toUserId: string; amount: number }[] = []
  const processedPairs = new Set<string>()

  debts.forEach((amount, key) => {
    const [debtorId, creditorId] = key.split('-')
    const reverseKey = `${creditorId}-${debtorId}`
    
    if (processedPairs.has(key) || processedPairs.has(reverseKey)) return

    const reverseAmount = debts.get(reverseKey) || 0
    
    if (amount > reverseAmount) {
      result.push({ fromUserId: debtorId, toUserId: creditorId, amount: amount - reverseAmount })
    } else if (reverseAmount > amount) {
      result.push({ fromUserId: creditorId, toUserId: debtorId, amount: reverseAmount - amount })
    }
    
    processedPairs.add(key)
    processedPairs.add(reverseKey)
  })

  return result
}
