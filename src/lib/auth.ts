import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { db } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // For demo purposes, create or get user without password verification
        // In production, you'd verify with bcrypt
        let user = await db.user.findUnique({
          where: { email: credentials.email },
          include: { settings: true }
        })

        if (!user) {
          // Create new user for demo
          user = await db.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
              settings: {
                create: {}
              }
            },
            include: { settings: true }
          })
        }

        if (!user.isActive) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        }
      }
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}