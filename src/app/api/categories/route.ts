import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const SYSTEM_CATEGORIES = [
  "Habitação",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Lazer",
  "Educação",
  "Outros"
]

export async function GET(request: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    // Fetch user custom categories
    const userCategories = await prisma.category.findMany({
      where: { userId: session.user.id },
      select: { id: true, name: true }
    })

    // Combine with system categories
    const categories = [
      ...SYSTEM_CATEGORIES.map(name => ({ id: name, name, isSystem: true })),
      ...userCategories.map(cat => ({ ...cat, isSystem: false }))
    ]

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Categories fetch error:", error)
    return NextResponse.json(
      { error: "Erro ao buscar categorias" },
      { status: 500 }
    )
  }
}
