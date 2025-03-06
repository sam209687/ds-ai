import { auth } from "@/auth"
import { Role } from "@prisma/client"

export async function isAdmin() {
  const session = await auth()
  return session?.user?.role === Role.ADMIN
} 