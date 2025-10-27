import { Role } from '@prisma/client';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      mustChangePassword: boolean; // <-- ADICIONE ESTA LINHA
    } & DefaultSession['user'];
  }
  interface User {
    role: Role;
    mustChangePassword: boolean; // <-- ADICIONE ESTA LINHA
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    mustChangePassword: boolean; // <-- ADICIONE ESTA LINHA
  }
}