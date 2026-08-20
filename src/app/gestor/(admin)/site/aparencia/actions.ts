// src/app/gestor/(admin)/site/aparencia/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper de segurança
async function canManageSite() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;
  if (session.user.role === 'MASTER') return true;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { permissions: { select: { name: true } } }
  });
  return user?.permissions.some(p => p.name === 'manage_site') || false;
}

export async function updatePageSettings(pageKey: string, newImageUrl: string) {
  if (!(await canManageSite())) {
    return { success: false, message: 'Acesso negado.' };
  }

  if (!pageKey || !newImageUrl) {
    return { success: false, message: "Dados inválidos." };
  }

  try {
    await prisma.pageSettings.update({
      where: { pageKey },
      data: { heroImageUrl: newImageUrl },
    });

    revalidatePath('/sobre'); // Invalida o cache da página "Sobre"
    return { success: true, message: "Imagem da Hero Section atualizada com sucesso!" };

  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    return { success: false, message: "Erro ao salvar no banco de dados." };
  }
}