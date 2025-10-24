// src/app/gestor/(admin)/site/servicos/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Prisma, Service } from '@prisma/client'; // Importa o tipo Service

// Função auxiliar para extrair o ID do vídeo
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) return match[2];
  if (url.length === 11) return url;
  return null;
}

// Schema de validação para o formulário de serviço
const serviceSchema = z.object({
  name: z.string().min(3, 'O nome do serviço é obrigatório.'),
  icon: z.string().min(2, 'A seleção do ícone é obrigatória.'),
  shortDescription: z.string().min(10, 'A descrição curta é obrigatória.'),
  longDescription: z.string().min(20, 'A descrição longa é obrigatória.'),
  image: z.string().url('A URL da imagem de destaque é inválida.'),
  videoUrl: z.string().nullable().optional(), // ID do vídeo (pode ser nulo)
});

// AÇÃO PARA CRIAR UM NOVO SERVIÇO
export async function createService(formData: FormData) {
  const data = Object.fromEntries(formData);
  const fullVideoUrl = data.videoUrl as string;
  let videoId: string | null = null;

  if (fullVideoUrl && fullVideoUrl.trim() !== '') {
    videoId = extractYouTubeId(fullVideoUrl);
    if (!videoId) {
      return { success: false, message: 'A URL do vídeo do YouTube é inválida.' };
    }
  }

  const parsedData = { ...data, videoUrl: videoId };
  const validatedFields = serviceSchema.safeParse(parsedData);

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0]?.message || 'Dados inválidos.';
    return { success: false, message: errorMessage };
  }

  try {
    await prisma.service.create({
      data: validatedFields.data,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, message: 'Um serviço com este nome já existe.' };
    }
    console.error("Erro ao criar serviço:", error);
    return { success: false, message: 'Erro no banco de dados.' };
  }

  revalidatePath('/gestor/site/servicos');
  revalidatePath('/servicos');
  return { success: true, message: 'Serviço criado com sucesso!' };
}

// AÇÃO PARA EXCLUIR UM SERVIÇO
export async function deleteService(id: string) {
  if (!id) {
    return { success: false, message: "ID do serviço não fornecido." };
  }
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath('/gestor/site/servicos');
    revalidatePath('/servicos');
    return { success: true, message: 'Serviço excluído com sucesso!' };
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);
    return { success: false, message: 'Erro ao excluir o serviço. Verifique se não há portfólios associados.' };
  }
}

// =================================================================
// AÇÃO PARA ATUALIZAR UM SERVIÇO (LÓGICA COMPLETA E CORRIGIDA)
// =================================================================
export async function updateService(id: string, formData: FormData) {
  const data = Object.fromEntries(formData);
  const fullVideoUrl = data.videoUrl as string;
  let videoId: string | null = null;

  if (fullVideoUrl && fullVideoUrl.trim() !== '') {
    videoId = extractYouTubeId(fullVideoUrl);
    if (!videoId) {
      return { success: false, message: 'A URL do vídeo do YouTube é inválida.' };
    }
  }

  const parsedData = { ...data, videoUrl: videoId };
  const validatedFields = serviceSchema.safeParse(parsedData);

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0]?.message || 'Dados inválidos.';
    return { success: false, message: errorMessage };
  }

  try {
    const currentService = await prisma.service.findUnique({ where: { id } });
    if (!currentService) {
      return { success: false, message: "Serviço não encontrado." };
    }

    const dataToUpdate: Partial<Service> = {};
    const newData = validatedFields.data;

    if (newData.name !== currentService.name) dataToUpdate.name = newData.name;
    if (newData.icon !== currentService.icon) dataToUpdate.icon = newData.icon;
    if (newData.shortDescription !== currentService.shortDescription) dataToUpdate.shortDescription = newData.shortDescription;
    if (newData.longDescription !== currentService.longDescription) dataToUpdate.longDescription = newData.longDescription;
    if (newData.image !== currentService.image) dataToUpdate.image = newData.image;
    if (newData.videoUrl !== currentService.videoUrl) dataToUpdate.videoUrl = newData.videoUrl;

    if (Object.keys(dataToUpdate).length === 0) {
      return { success: true, message: 'Nenhuma alteração detectada.' };
    }

    await prisma.service.update({
      where: { id: id },
      data: dataToUpdate,
    });

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, message: 'Um serviço com este nome já existe.' };
    }
    console.error("Erro ao atualizar serviço:", error);
    return { success: false, message: "Erro ao atualizar o serviço." };
  }

  revalidatePath('/gestor/site/servicos');
  revalidatePath('/servicos');
  return { success: true, message: 'Serviço atualizado com sucesso!' };
}