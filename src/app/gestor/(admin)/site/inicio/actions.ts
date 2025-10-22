// src/app/gestor/(admin)/site/inicio/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Função auxiliar para extrair o ID do vídeo (já suporta os dois formatos)
function extractYouTubeId(url: string): string | null {
  // RegEx que funciona para a maioria dos links do YouTube (watch, youtu.be, embed)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  // Se encontrar um ID de 11 caracteres, retorna ele
  if (match && match[2].length === 11) {
    return match[2];
  }
  
  // Se o usuário colar SÓ o ID, também funciona
  if (url.length === 11) {
    return url;
  }

  return null;
}

// Schema de validação ATUALIZADO:
// Agora aceita um dos dois formatos de link
const heroSchema = z.object({
  youtubeLink: z.string()
    .min(11, "URL ou ID inválido.")
    .refine((url) => 
      url.startsWith("https://www.youtube.com/watch?") || 
      url.startsWith("https://youtu.be/") ||
      url.length === 11, // Permite colar só o ID
      "O link deve ser um link válido do YouTube (youtube.com ou youtu.be)"
    ),
});

export async function getHomePageData() {
  let homeData = await prisma.homePage.findFirst();
  if (!homeData) {
    homeData = await prisma.homePage.create({
      data: { youtubeVideoId: 'xk4lN3K5jzg' }
    });
  }
  return homeData;
}

// Server Action ATUALIZADA
export async function updateHeroVideo(formData: FormData) {
  const validatedFields = heroSchema.safeParse({
    youtubeLink: formData.get('youtubeLink'),
  });

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0]?.message || 'Link inválido.';
    return { success: false, message: errorMessage };
  }

  // 1. Extrai o ID do link validado
  const videoId = extractYouTubeId(validatedFields.data.youtubeLink);

  if (!videoId) {
    return { success: false, message: 'Não foi possível extrair um ID válido do link. Verifique o link.' };
  }

  // 2. Salva APENAS O ID no banco de dados
  try {
    const homeData = await getHomePageData();
    
    if (homeData.youtubeVideoId === videoId) {
      return { success: true, message: 'Nenhuma alteração detectada.' };
    }

    await prisma.homePage.update({
      where: { id: homeData.id },
      data: { youtubeVideoId: videoId },
    });

    revalidatePath('/');
    return { success: true, message: 'Vídeo da Hero Section atualizado com sucesso!' };

  } catch (error) {
    console.error("Erro ao atualizar o vídeo:", error);
    return { success: false, message: 'Erro ao salvar. Tente novamente.' };
  }
}