// src/types/next-auth.d.ts

import { Role } from '@prisma/client';
import { DefaultSession } from 'next-auth';
import { JWT } from "next-auth/jwt";

// Estende os tipos nativos do NextAuth
declare module 'next-auth' {
  /**
   * Retornado por `useSession`, `getSession`, etc.
   * Estende o objeto 'user' dentro da sessão.
   */
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession['user']; // Combina nossas propriedades com as padrão (name, email, image)
  }

  /**
   * Estende o objeto 'user' que é retornado no callback 'authorize'
   * e passado para o callback 'jwt'.
   */
  interface User {
    role: Role;
  }
}

// Estende o tipo do token JWT
declare module "next-auth/jwt" {
  /** Retornado pelo callback `jwt` */
  interface JWT {
    id: string;
    role: Role;
  }
}