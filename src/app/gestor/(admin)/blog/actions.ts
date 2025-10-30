// src/app/gestor/(admin)/blog/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { Status } from '@prisma/client';

// --- HELPER DE SEGURANÇA ---
// Verifica se o usuário logado tem permissão para gerenciar o blog
async function canManageBlog() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;
  if (session.user.role === 'MASTER') return true;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { permissions: { select: { name: true } } }
  });
  return user?.permissions.some(p => p.name === 'manage_blog') || false;
}

// --- FUNÇÕES UTILITÁRIAS ---

// Função para gerar um slug a partir de um título (ex: "Meu Post Incrível" -> "meu-post-incrivel")
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD") // Remove acentos
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres não alfanuméricos, exceto espaços e hífens
    .trim()
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-"); // Remove hífens duplicados
}

// Função para calcular o tempo de leitura estimado
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200; // Média de palavras que um adulto lê por minuto
  const text = content.replace(/<[^>]*>/g, ""); // Remove tags HTML para contar apenas o texto
  const wordCount = text.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}


// --- SCHEMA DE VALIDAÇÃO (Zod) ---
const postSchema = z.object({
  postId: z.string().optional(), 
  title: z.string().min(5, "O título é muito curto."),
  content: z.string().min(20, "O conteúdo é muito curto."),
  status: z.nativeEnum(Status),
  
  featuredImageUrl: z.string().url("URL inválida.").optional().or(z.literal('')),
  // NOVOS CAMPOS DE IMAGEM
  featuredImageAlt: z.string().optional(),
  featuredImageSource: z.string().optional(),

  isFeatured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  categories: z.string().optional(),
  tags: z.string().optional(),
});


// --- ACTION 1: CRIAR UM NOVO POST ---
export async function createPostAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !(await canManageBlog())) {
      return { success: false, message: "Acesso negado." };
    }

    const dataToValidate = {
      ...Object.fromEntries(formData),
      isFeatured: formData.get('isFeatured') === 'on',
    };

    const validatedFields = postSchema.safeParse(dataToValidate);
    if (!validatedFields.success) {
      return { success: false, message: validatedFields.error.issues[0].message };
    }

    const { 
      title, content, status, featuredImageUrl, featuredImageAlt, featuredImageSource,
      isFeatured, seoTitle, seoDescription, categories, tags 
    } = validatedFields.data;

    let slug = generateSlug(title);
    const existingPost = await prisma.post.findUnique({ where: { slug } });
    if (existingPost) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const estimatedReadingTime = calculateReadingTime(content);

    const categoryConnectOrCreate = categories?.split(',').map(name => name.trim()).filter(Boolean).map(name => ({
      where: { slug: generateSlug(name) },
      create: { name, slug: generateSlug(name) },
    })) || [];
    
    const tagConnectOrCreate = tags?.split(',').map(name => name.trim()).filter(Boolean).map(name => ({
      where: { slug: generateSlug(name) },
      create: { name, slug: generateSlug(name) },
    })) || [];

   await prisma.post.create({
      data: {
        title, slug, content, status,
        authorId: session.user.id,
        // NOVOS CAMPOS
        featuredImageUrl: featuredImageUrl || null,
        featuredImageAlt,
        featuredImageSource,
        isFeatured, seoTitle, seoDescription, estimatedReadingTime,
        categories: { connectOrCreate: categoryConnectOrCreate },
        tags: { connectOrCreate: tagConnectOrCreate },
      }
    });

    revalidatePath('/blog');
    revalidatePath('/gestor/blog');

    return { success: true, message: "Post criado com sucesso!" };

  } catch (error) {
    console.error("Erro ao criar post:", error);
    return { success: false, message: "Ocorreu um erro no servidor." };
  }
}

// --- ACTION 2: DELETAR UM POST ---
export async function deletePostAction(postId: string) {
    try {
        if (!(await canManageBlog())) {
            return { success: false, message: "Acesso negado." };
        }

        await prisma.post.delete({
            where: { id: postId },
        });

        revalidatePath('/blog');
        revalidatePath('/gestor/blog');

        return { success: true, message: "Post deletado com sucesso." };
    } catch (error) {
        console.error("Erro ao deletar post:", error);
        return { success: false, message: "Ocorreu um erro no servidor." };
    }
}

// --- NOVA ACTION: ATUALIZAR UM POST EXISTENTE ---
export async function updatePostAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !(await canManageBlog())) {
      return { success: false, message: "Acesso negado." };
    }

    const dataToValidate = {
      ...Object.fromEntries(formData),
      isFeatured: formData.get('isFeatured') === 'on',
    };

    const validatedFields = postSchema.safeParse(dataToValidate);
    if (!validatedFields.success) {
      return { success: false, message: validatedFields.error.issues[0].message };
    }

    const { 
      postId, title, content, status, featuredImageUrl, featuredImageAlt, featuredImageSource,
      isFeatured, seoTitle, seoDescription, categories, tags 
    } = validatedFields.data;

    if (!postId) {
      return { success: false, message: "ID do post não encontrado." };
    }
    
    const estimatedReadingTime = calculateReadingTime(content);

    const categoryConnectOrCreate = categories?.split(',').map(name => name.trim()).filter(Boolean).map(name => ({
      where: { slug: generateSlug(name) },
      create: { name, slug: generateSlug(name) },
    })) || [];
    
    const tagConnectOrCreate = tags?.split(',').map(name => name.trim()).filter(Boolean).map(name => ({
      where: { slug: generateSlug(name) },
      create: { name, slug: generateSlug(name) },
    })) || [];

    await prisma.post.update({
      where: { id: postId },
      data: {
        title, content, status,
        // NOVOS CAMPOS
        featuredImageUrl: featuredImageUrl || null,
        featuredImageAlt,
        featuredImageSource,
        isFeatured, seoTitle, seoDescription, estimatedReadingTime,
        // RASTREAMENTO DE EDIÇÃO
        lastEditorId: session.user.id,
        categories: { set: [], connectOrCreate: categoryConnectOrCreate },
        tags: { set: [], connectOrCreate: tagConnectOrCreate },
      }
    });

    revalidatePath('/blog');
    revalidatePath('/gestor/blog');

    return { success: true, message: "Post atualizado com sucesso!" };

  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    return { success: false, message: "Ocorreu um erro no servidor ao atualizar o post." };
  }
}