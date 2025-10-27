// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Adiciona `prisma` ao objeto global do Node.js
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Previne múltiplas instâncias do PrismaClient em desenvolvimento
export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}