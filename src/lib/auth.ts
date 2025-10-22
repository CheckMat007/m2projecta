// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // 1. O backend agora espera o 'recaptchaToken'
      credentials: { 
        email: { label: "Email", type: "email" }, 
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password || !credentials.recaptchaToken) {
          console.log("Authorize failed: missing credentials or reCAPTCHA token");
          return null;
        }

        // 2. VERIFICAÇÃO DO RECAPTCHA (ANTES DE TUDO)
        try {
          const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${credentials.recaptchaToken}`,
          });
          const recaptchaData = await recaptchaResponse.json();

          if (!recaptchaData.success) {
            console.log("reCAPTCHA verification failed:", recaptchaData['error-codes']);
            return null; // Bloqueia o login se a verificação falhar
          }
        } catch (err) {
          console.error("Error verifying reCAPTCHA:", err);
          return null;
        }
        
        // 3. SE O RECAPTCHA FOR VÁLIDO, CONTINUA COM O LOGIN
        try {
          const user = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (!user) {
            console.log("Authorize failed: user not found");
            return null;
          }

          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) {
            console.log("Authorize failed: password invalid for user:", credentials.email);
            return null;
          }

          console.log("Authorize success for user:", user.email);
          return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role };
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }
      if (trigger === "update" && session) {
        token.name = session.name;
        token.picture = session.image;
        token.image = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
  // debug: process.env.NODE_ENV === 'development',
};