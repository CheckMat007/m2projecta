// src/app/gestor/(admin)/site/inicio/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Função auxiliar para extrair o ID do vídeo (suporta links normais, youtu.be, embed e Shorts)
function extractYouTubeId(url: string): string | null {
  // RegEx que funciona para a maioria dos links do YouTube (watch, youtu.be, embed, shorts)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
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

// Função auxiliar para detectar se o link é um YouTube Shorts (vídeo vertical)
function isYouTubeShort(url: string): boolean {
  return url.includes('youtube.com/shorts/');
}

// Schema de validação ATUALIZADO:
// Agora aceita links normais, youtu.be e Shorts
const heroSchema = z.object({
  youtubeLink: z.string()
    .min(11, "URL ou ID inválido.")
    .refine((url) =>
      url.startsWith("https://www.youtube.com/watch?") ||
      url.startsWith("https://www.youtube.com/shorts/") ||
      url.startsWith("https://youtube.com/shorts/") ||
      url.startsWith("https://youtu.be/") ||
      url.length === 11, // Permite colar só o ID
      "O link deve ser um link válido do YouTube (youtube.com, youtu.be ou Shorts)"
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

  // 2. Detecta se é um Shorts (vídeo vertical)
  const isVertical = isYouTubeShort(validatedFields.data.youtubeLink);

  // 3. Salva o ID e a orientação no banco de dados
  try {
    const homeData = await getHomePageData();

    if (homeData.youtubeVideoId === videoId && homeData.youtubeVideoIsVertical === isVertical) {
      return { success: true, message: 'Nenhuma alteração detectada.' };
    }

    await prisma.homePage.update({
      where: { id: homeData.id },
      data: { youtubeVideoId: videoId, youtubeVideoIsVertical: isVertical },
    });

    revalidatePath('/');
    return { success: true, message: 'Vídeo da Hero Section atualizado com sucesso!' };

  } catch (error) {
    console.error("Erro ao atualizar o vídeo:", error);
    return { success: false, message: 'Erro ao salvar. Tente novamente.' };
  }
}

// =================================================================
// NOVAS AÇÕES PARA GERENCIAR DEPOIMENTOS (TESTIMONIALS)
// =================================================================

// Schema de validação para um novo depoimento
const testimonialSchema = z.object({
  name: z.string().min(3, 'O nome é obrigatório.'),
  company: z.string().min(3, 'A empresa é obrigatória.'),
  quote: z.string().min(10, 'A citação é obrigatória.'),
  highlight: z.string().optional(),
  image: z.string().url('A URL da imagem é obrigatória.').optional().or(z.literal('')),
});

// AÇÃO PARA CRIAR UM NOVO DEPOIMENTO
export async function createTestimonial(formData: FormData) {
  const validatedFields = testimonialSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0]?.message || 'Dados inválidos.';
    return { success: false, message: errorMessage };
  }

  try {
    // Encontra a maior ordem atual para adicionar o novo no final
    const lastTestimonial = await prisma.testimonial.findFirst({
      orderBy: { order: 'desc' },
    });
    const newOrder = (lastTestimonial?.order || 0) + 1;

    await prisma.testimonial.create({
      data: {
        ...validatedFields.data,
        order: newOrder,
      },
    });
  } catch (error) {
    console.error("Erro ao criar depoimento:", error);
    return { success: false, message: 'Erro no banco de dados. Tente novamente.' };
  }

  revalidatePath('/gestor/site/inicio'); // Atualiza a lista no painel
  revalidatePath('/'); // Atualiza a home page pública
  return { success: true, message: 'Depoimento adicionado com sucesso!' };
}

// AÇÃO PARA EXCLUIR UM DEPOIMENTO
export async function deleteTestimonial(id: string) {
  if (!id) {
    return { success: false, message: 'ID do depoimento não fornecido.' };
  }

  try {
    await prisma.testimonial.delete({
      where: { id: id },
    });
  } catch (error) {
    console.error("Erro ao excluir depoimento:", error);
    return { success: false, message: 'Erro no banco de dados. Tente novamente.' };
  }

  revalidatePath('/gestor/site/inicio');
  revalidatePath('/');
  return { success: true, message: 'Depoimento excluído com sucesso!' };
}

// AÇÃO PARA ATUALIZAR UM DEPOIMENTO (será usada na página de edição)
export async function updateTestimonial(id: string, formData: FormData) {
  const validatedFields = testimonialSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0]?.message || 'Dados inválidos.';
    return { success: false, message: errorMessage };
  }
  
  try {
    await prisma.testimonial.update({
      where: { id: id },
      data: validatedFields.data,
    });
  } catch (error) {
    console.error("Erro ao atualizar depoimento:", error);
    return { success: false, message: 'Erro no banco de dados. Tente novamente.' };
  }

  revalidatePath('/gestor/site/inicio');
  revalidatePath('/');
  return { success: true, message: 'Depoimento atualizado com sucesso!' };
}

// =================================================================
// NOVAS AÇÕES PARA GERENCIAR FAQ
// =================================================================

// Schema de validação para um item de FAQ
const faqItemSchema = z.object({
  question: z.string().min(5, 'A pergunta deve ter pelo menos 5 caracteres.'),
  answer: z.string().min(10, 'A resposta deve ter pelo menos 10 caracteres.'),
});

// AÇÃO PARA CRIAR UM NOVO ITEM DE FAQ
export async function createFaqItem(formData: FormData) {
  const validatedFields = faqItemSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0]?.message || 'Dados inválidos.';
    return { success: false, message: errorMessage };
  }

  try {
    const lastFaqItem = await prisma.faqItem.findFirst({
      orderBy: { order: 'desc' },
    });
    const newOrder = (lastFaqItem?.order || 0) + 1;

    await prisma.faqItem.create({
      data: {
        ...validatedFields.data,
        order: newOrder,
      },
    });
  } catch (error) {
    console.error("Erro ao criar item de FAQ:", error);
    return { success: false, message: 'Erro no banco de dados.' };
  }

  revalidatePath('/gestor/site/inicio');
  revalidatePath('/');
  return { success: true, message: 'Pergunta adicionada com sucesso!' };
}

// AÇÃO PARA EXCLUIR UM ITEM DE FAQ
export async function deleteFaqItem(id: string) {
  if (!id) return { success: false, message: 'ID não fornecido.' };
  try {
    await prisma.faqItem.delete({ where: { id } });
  } catch (error) {
    console.error("Erro ao excluir item de FAQ:", error);
    return { success: false, message: 'Erro no banco de dados.' };
  }
  revalidatePath('/gestor/site/inicio');
  revalidatePath('/');
  return { success: true, message: 'Pergunta excluída com sucesso!' };
}

// AÇÃO PARA ATUALIZAR UM ITEM DE FAQ
export async function updateFaqItem(id: string, formData: FormData) {
  const validatedFields = faqItemSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0]?.message || 'Dados inválidos.';
    return { success: false, message: errorMessage };
  }
  
  try {
    await prisma.faqItem.update({
      where: { id },
      data: validatedFields.data,
    });
  } catch (error) {
    console.error("Erro ao atualizar item de FAQ:", error);
    return { success: false, message: 'Erro no banco de dados.' };
  }

  revalidatePath('/gestor/site/inicio');
  revalidatePath('/');
  return { success: true, message: 'Pergunta atualizada com sucesso!' };
}