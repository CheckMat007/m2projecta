// src/app/gestor/(admin)/site/aparencia/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updatePageSettings(pageKey: string, newImageUrl: string) {
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