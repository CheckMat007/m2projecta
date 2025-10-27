// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials.password) return null;

          const user = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (!user) return null;

          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) return null;

          // 1. ADICIONADO: Retornar o campo 'mustChangePassword' do banco de dados
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            mustChangePassword: user.mustChangePassword, // <-- Adicionado aqui
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      }
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/gestor/login" },
  callbacks: {
    async jwt({ token, user }) { // Simplificado para clareza, mas pode incluir trigger/session
      if (user) {
        token.id = user.id;
        token.role = user.role;
        // 2. ADICIONADO: Inserir o campo no token JWT
        token.mustChangePassword = user.mustChangePassword; // <-- Adicionado aqui
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        // 3. ADICIONADO: Inserir o campo no objeto da sessão final
        session.user.mustChangePassword = token.mustChangePassword as boolean; // <-- Adicionado aqui
      }
      return session;
    },
  },
  debug: false, // Recomendo desabilitar o debug em produção
};