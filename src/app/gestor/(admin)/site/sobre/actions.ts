// src/app/gestor/(admin)/site/sobre/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
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

// Schema de validação para o conteúdo da página "Sobre"
const contentSchema = z.object({
  title: z.string().min(5, "O título é muito curto."),
  mainText: z.string().min(20, "O texto principal é muito curto."),
  mainImageUrl: z.string().url("A URL da imagem é inválida. O upload pode ter falhado."),
});

// Ação para ATUALIZAR o conteúdo da página "Sobre"
export async function updateAboutContent(formData: FormData) {
  if (!(await canManageSite())) {
    return { success: false, message: 'Acesso negado.' };
  }

  const validatedFields = contentSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.issues[0].message };
  }

  try {
    // Como só temos uma linha de conteúdo para a página, buscamos a primeira
    const currentContent = await prisma.aboutPageContent.findFirst();
    if (!currentContent) {
      throw new Error("Conteúdo da página 'Sobre' não encontrado no banco de dados.");
    }
    
    await prisma.aboutPageContent.update({
      where: { id: currentContent.id },
      data: validatedFields.data,
    });

    revalidatePath('/sobre'); // Força a atualização do cache da página pública
    revalidatePath('/gestor/site/sobre'); // Força a atualização do cache da página do painel
    
    return { success: true, message: "Conteúdo da página 'Sobre Nós' atualizado com sucesso!" };

  } catch (error) {
    console.error("Erro ao atualizar o conteúdo:", error);
    return { success: false, message: "Erro ao salvar no banco de dados. Tente novamente." };
  }
}