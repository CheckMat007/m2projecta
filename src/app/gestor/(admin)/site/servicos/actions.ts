// src/app/gestor/(admin)/site/servicos/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// --- HELPER DE SEGURANÇA ---
async function canManageServices() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;
  if (session.user.role === 'MASTER') return true;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { permissions: { select: { name: true } } }
  });
  // "Serviços" é uma subseção de "Gerenciar Site" no menu, então usa a mesma permissão.
  return user?.permissions.some(p => p.name === 'manage_site') || false;
}

// --- FUNÇÕES UTILITÁRIAS ---

// Extrair ID do YouTube
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) return match[2];
  if (url.length === 11) return url;
  return null;
}

// Gerar Slug (URL amigável)
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// --- SCHEMA DE VALIDAÇÃO ---
const serviceSchema = z.object({
  serviceId: z.string().optional(),
  name: z.string().min(3, 'O nome do serviço é obrigatório.'),
  icon: z.string().min(2, 'A seleção do ícone é obrigatória.'),
  shortDescription: z.string().min(10, 'A descrição curta é obrigatória.'),
  longDescription: z.string().min(20, 'A descrição longa é obrigatória.'),
  image: z.string().url('A URL da imagem de destaque é inválida.'),
  videoUrl: z.string().nullable().optional(),
});

// --- ACTION: CRIAR OU ATUALIZAR SERVIÇO (UPSERT) ---
export async function upsertServiceAction(formData: FormData) {
  try {
    if (!(await canManageServices())) {
      return { success: false, message: "Acesso negado." };
    }

    const rawData = Object.fromEntries(formData);
    const fullVideoUrl = rawData.videoUrl as string;
    let videoId: string | null = null;

    if (fullVideoUrl && fullVideoUrl.trim() !== '') {
      videoId = extractYouTubeId(fullVideoUrl);
      if (!videoId) {
        return { success: false, message: 'A URL do vídeo do YouTube é inválida.' };
      }
    }

    const parsedData = { ...rawData, videoUrl: videoId };
    const validatedFields = serviceSchema.safeParse(parsedData);

    if (!validatedFields.success) {
      return { success: false, message: validatedFields.error.issues[0].message };
    }

    const { serviceId, name, ...rest } = validatedFields.data;
    const slug = generateSlug(name);

    // --- MODO ATUALIZAÇÃO ---
    if (serviceId) {
      const currentService = await prisma.service.findUnique({ where: { id: serviceId } });
      if (!currentService) return { success: false, message: "Serviço não encontrado." };

      // Verifica se o novo slug colide com outro serviço (que não seja este mesmo)
      if (slug !== currentService.slug) {
          const existingSlug = await prisma.service.findUnique({ where: { slug } });
          if (existingSlug) return { success: false, message: "Já existe um serviço com este nome." };
      }

      await prisma.service.update({
        where: { id: serviceId },
        data: { name, slug, ...rest }
      });

      // Revalida a página antiga e a nova (caso o slug mude)
      revalidatePath(`/servicos/${currentService.slug}`); 
      revalidatePath(`/servicos/${slug}`);
      
      // Revalida as listagens
      revalidatePath('/servicos');
      revalidatePath('/gestor/site/servicos');
      
      return { success: true, message: 'Serviço atualizado com sucesso!' };
    } 
    
    // --- MODO CRIAÇÃO ---
    else {
       const existingSlug = await prisma.service.findUnique({ where: { slug } });
       if (existingSlug) return { success: false, message: "Já existe um serviço com este nome." };

       await prisma.service.create({
         data: { name, slug, ...rest }
       });

       revalidatePath('/servicos');
       revalidatePath('/gestor/site/servicos');
       return { success: true, message: 'Serviço criado com sucesso!' };
    }

  } catch (error) {
    console.error("Erro ao salvar serviço:", error);
    return { success: false, message: "Erro no banco de dados." };
  }
}

// --- ACTION: DELETAR SERVIÇO ---
export async function deleteService(id: string) {
  if (!id) return { success: false, message: "ID do serviço não fornecido." };
  
  try {
    if (!(await canManageServices())) {
        return { success: false, message: "Acesso negado." };
    }

    await prisma.service.delete({ where: { id } });
    
    revalidatePath('/gestor/site/servicos');
    revalidatePath('/servicos');
    return { success: true, message: 'Serviço excluído com sucesso!' };
  } catch (error) {
    console.error("Erro ao excluir serviço:", error);
    return { success: false, message: 'Erro ao excluir. Verifique se há portfólios associados.' };
  }
}