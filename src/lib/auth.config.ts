import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import {prisma} from "./prisma";
import { signInSchema } from "./signInSchema";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const dbUser = await prisma.user.findUnique({
          where: { email },
          include: { role: true, permissions: { include: { permission: true } } }
        });

        if (!dbUser?.hashedPassword) return null;

        const passwordsMatch = await bcrypt.compare(password, dbUser.hashedPassword);
        if (!passwordsMatch) return null;

        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role ? { name: dbUser.role.name } : undefined,
          permissions: dbUser.permissions
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as { name: string };
        session.user.permissions = token.permissions;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      return `${baseUrl}/dashboard`;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { role: true, permissions: true }
        });

        if (dbUser) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              name: user.name ?? dbUser.name,
              image: user.image
            }
          });
          return true;
        }

        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name ?? user.email,
            image: user.image,
            role: {
              connect: { name: "USER" }
            }
          }
        });
      }
      return true;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
} satisfies NextAuthConfig;
