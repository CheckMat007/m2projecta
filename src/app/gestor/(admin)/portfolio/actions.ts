// src/app/gestor/(admin)/portfolio/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PortfolioItem, Status } from '@prisma/client';
import { Prisma } from '@prisma/client';

const MAX_FEATURED_ITEMS = 10;

// Função auxiliar para checar o limite de destaques
async function checkFeaturedLimit() {
  const featuredCount = await prisma.portfolioItem.count({
    where: { isFeatured: true },
  });
  return featuredCount;
}

// Função auxiliar para extrair o ID do vídeo do YouTube (suporta vídeos normais e Shorts)
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  if (url.length === 11) {
    return url;
  }
  return null;
}

// Função auxiliar para detectar se o link é um YouTube Shorts (vídeo vertical)
function isYouTubeShort(url: string): boolean {
  return url.includes('youtube.com/shorts/');
}

// Schema de validação do Zod ATUALIZADO
const portfolioItemSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.').max(100, 'O título deve ter no máximo 100 caracteres.'),
  serviceId: z.string().min(1, 'A categoria (serviço) é obrigatória.'), // ALTERADO de 'category' para 'serviceId'
  shortDescription: z.string().min(10, 'A descrição curta deve ter pelo menos 10 caracteres.').max(200, 'A descrição curta deve ter no máximo 200 caracteres.'),
  longDescription: z.string().min(20, 'A descrição longa deve ter pelo menos 20 caracteres.'),
  coverImage: z.string().url('A URL da imagem de capa é inválida.'),
  galleryImages: z.array(z.string().url('Uma das URLs da galeria é inválida.')).default([]),
  videoUrl: z.string().nullable().optional(),
  videoIsVertical: z.boolean().default(false),
  status: z.nativeEnum(Status),
  isFeatured: z.boolean(),
  seoTitle: z.string().max(60, 'O Título SEO deve ter no máximo 60 caracteres.').optional(),
  seoDescription: z.string().max(160, 'A Descrição SEO deve ter no máximo 160 caracteres.').optional(),
});

// Função auxiliar para extrair a lista de URLs da galeria enviada como JSON
function parseGalleryImages(raw: FormDataEntryValue | undefined): string[] {
  if (!raw || typeof raw !== 'string') return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((url) => typeof url === 'string') : [];
  } catch {
    return [];
  }
}

// Ação de CRIAR (Atualizada)
export async function createPortfolioItem(formData: FormData) {
  const data = Object.fromEntries(formData);
  const isFeatured = data.isFeatured === 'on';

  if (isFeatured) {
    const featuredCount = await checkFeaturedLimit();
    if (featuredCount >= MAX_FEATURED_ITEMS) {
      return { success: false, message: `Limite de ${MAX_FEATURED_ITEMS} itens em destaque atingido.` };
    }
  }

  const fullVideoUrl = data.videoUrl as string;
  let videoId: string | null = null;
  let videoIsVertical = false;

  if (fullVideoUrl && fullVideoUrl.trim() !== '') {
    videoId = extractYouTubeId(fullVideoUrl);
    if (!videoId) {
      return { success: false, message: 'A URL do vídeo do YouTube é inválida.' };
    }
    videoIsVertical = isYouTubeShort(fullVideoUrl);
  }

  const parsedData = {
    ...data,
    status: data.status as Status,
    isFeatured: isFeatured,
    videoUrl: videoId,
    videoIsVertical,
    galleryImages: parseGalleryImages(data.galleryImages),
  };

  const validatedFields = portfolioItemSchema.safeParse(parsedData);

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0]?.message || 'Dados inválidos.';
    console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
    return { success: false, message: errorMessage };
  }

  try {
    await prisma.portfolioItem.create({
      data: validatedFields.data,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, message: 'Um item com este título já existe.' };
    }
    console.error("Erro ao criar item:", error);
    return { success: false, message: 'Erro no banco de dados. Tente novamente.' };
  }

  revalidatePath('/gestor/portfolio');
  revalidatePath('/portfolio');
  revalidatePath('/');
  
  redirect('/gestor/portfolio');
}

// Ação de ATUALIZAR (Atualizada com a checagem)
export async function updatePortfolioItem(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const isFeatured = data.isFeatured === 'on';

  // Checa o limite ANTES de validar/atualizar
  if (isFeatured) {
    const featuredCount = await checkFeaturedLimit();
    const isCurrentlyFeatured = await prisma.portfolioItem.findFirst({
        where: { id: id, isFeatured: true }
    });

    // Só bloqueia se estivermos tentando ADICIONAR um novo destaque
    if (featuredCount >= MAX_FEATURED_ITEMS && !isCurrentlyFeatured) {
      return { success: false, message: `Limite de ${MAX_FEATURED_ITEMS} itens em destaque atingido. Desmarque outro item antes de atualizar este.` };
    }
  }

  const fullVideoUrl = data.videoUrl as string;
  let videoId: string | null = null;
  let videoIsVertical = false;

  if (fullVideoUrl && fullVideoUrl.trim() !== '') {
    videoId = extractYouTubeId(fullVideoUrl);
    if (!videoId) {
      return { success: false, message: 'A URL do vídeo do YouTube é inválida.' };
    }
    videoIsVertical = isYouTubeShort(fullVideoUrl);
  }

  const parsedData = {
    ...data,
    status: data.status as Status,
    isFeatured: isFeatured,
    videoUrl: videoId,
    videoIsVertical,
    galleryImages: parseGalleryImages(data.galleryImages),
  };

  const validatedFields = portfolioItemSchema.safeParse(parsedData);

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0]?.message || 'Dados inválidos.';
    return { success: false, message: errorMessage };
  }

  try {
    const currentItem = await prisma.portfolioItem.findUnique({
      where: { id: id },
    });
    if (!currentItem) {
      return { success: false, message: 'Projeto não encontrado.' };
    }

    const dataToUpdate: Partial<PortfolioItem> = {};
    const newData = validatedFields.data;

    if (newData.title !== currentItem.title) dataToUpdate.title = newData.title;
    if (newData.serviceId !== currentItem.serviceId) dataToUpdate.serviceId = newData.serviceId;
    if (newData.shortDescription !== currentItem.shortDescription) dataToUpdate.shortDescription = newData.shortDescription;
    if (newData.longDescription !== currentItem.longDescription) dataToUpdate.longDescription = newData.longDescription;
    if (newData.coverImage !== currentItem.coverImage) dataToUpdate.coverImage = newData.coverImage;
    if (JSON.stringify(newData.galleryImages) !== JSON.stringify(currentItem.galleryImages)) dataToUpdate.galleryImages = newData.galleryImages;
    if (newData.videoUrl !== currentItem.videoUrl) dataToUpdate.videoUrl = newData.videoUrl;
    if (newData.videoIsVertical !== currentItem.videoIsVertical) dataToUpdate.videoIsVertical = newData.videoIsVertical;
    if (newData.status !== currentItem.status) dataToUpdate.status = newData.status;
    if (newData.isFeatured !== currentItem.isFeatured) dataToUpdate.isFeatured = newData.isFeatured;
    if (newData.seoTitle !== currentItem.seoTitle) dataToUpdate.seoTitle = newData.seoTitle;
    if (newData.seoDescription !== currentItem.seoDescription) dataToUpdate.seoDescription = newData.seoDescription;

    if (Object.keys(dataToUpdate).length === 0) {
      return { success: true, message: 'Nenhuma alteração detectada.' };
    }

    await prisma.portfolioItem.update({
      where: { id: id },
      data: dataToUpdate,
    });

  } catch (error) {
    console.error("Erro ao atualizar item:", error);
    return { success: false, message: 'Erro no banco de dados. Tente novamente.' };
  }

  revalidatePath('/gestor/portfolio');
  revalidatePath(`/gestor/portfolio/editar/${id}`);
  revalidatePath('/portfolio');
  revalidatePath('/');
  
  // Retorna sucesso para o cliente lidar com o redirect
  return { success: true, message: 'Projeto atualizado com sucesso!' };
}

// Ação de DELETAR
export async function deletePortfolioItem(id: string) {
  if (!id) {
    return { success: false, message: 'ID do item não fornecido.' };
  }

  try {
    await prisma.portfolioItem.delete({
      where: { id: id },
    });
  } catch (error) {
    console.error("Erro ao deletar item:", error);
    return { success: false, message: 'Erro no banco de dados. Tente novamente.' };
  }

  revalidatePath('/gestor/portfolio');
  revalidatePath('/portfolio');
  revalidatePath('/');
  
  return { success: true, message: 'Projeto excluído com sucesso!' };
}

// AÇÃO PARA O SWITCH DA TABELA
export async function toggleFeaturedStatus(id: string, newStatus: boolean) {
  if (newStatus === true) {
    const featuredCount = await checkFeaturedLimit();
    if (featuredCount >= MAX_FEATURED_ITEMS) {
      return { success: false, message: `Limite de ${MAX_FEATURED_ITEMS} itens em destaque atingido.` };
    }
  }
  
  try {
    await prisma.portfolioItem.update({
      where: { id: id },
      data: { isFeatured: newStatus },
    });
    
    revalidatePath('/gestor/portfolio');
    revalidatePath('/');
    return { success: true, message: `Projeto ${newStatus ? 'destacado' : 'removido dos destaques'}.` };

  } catch (error) {
    console.error("Erro ao atualizar o status:", error);
    return { success: false, message: 'Erro ao atualizar o status.' };
  }
}