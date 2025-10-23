// src/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { prisma } from "@/lib/prisma"; // A CORREÇÃO ESTÁ AQUI

export const authOptions: NextAuthOptions = {
 adapter: PrismaAdapter(prisma),
 providers: [
 CredentialsProvider({
 name: "Credentials",
 credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
 async authorize(credentials) {
 try {
 if (!credentials?.email || !credentials.password) {
 console.log("Authorize failed: missing credentials");
 return null;
 }

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
 return { id: user.id, name: user.name, email: user.email, role: user.role };
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
 }
 return session;
 },
 },
 debug: true,
};