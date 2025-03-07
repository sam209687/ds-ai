import NextAuth from "next-auth"
// import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import authConfig from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { Role } from "@prisma/client"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.role = user.role
        }
        return token
      } catch (error) {
        console.error("JWT callback error:", error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (session.user) {
          session.user.role = token.role as Role
        }
        return session
      } catch (error) {
        console.error("Session callback error:", error)
        return session
      }
    }
  },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string
            password: string
          }

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              image: true,
              role: true,
            },
          })

          if (!user?.password) {
            console.log("No user found or no password")
            return null
          }

          const isValid = await compare(password, user.password)

          if (!isValid) {
            console.log("Invalid password")
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error("Authorize error:", error)
          return null
        }
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
})