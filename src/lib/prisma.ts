// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Esta declaração global ajuda a prevenir a criação de múltiplos clientes em desenvolvimento
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Se uma instância 'prisma' não existir, cria uma.
// Em desenvolvimento, isso usa a variável global para persistir o cliente entre os "hot reloads".
// Em produção, um novo cliente é criado apenas uma vez.
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}