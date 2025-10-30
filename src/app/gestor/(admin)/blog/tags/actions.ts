// src/app/gestor/(admin)/blog/tags/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Helper de Segurança
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

// Helper para gerar slugs
function generateSlug(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

// Schema de validação
const tagSchema = z.object({
  name: z.string().min(2, "O nome da tag é muito curto."),
});

// --- ACTION 1: CRIAR TAG ---
export async function createTagAction(formData: FormData) {
  try {
    if (!(await canManageBlog())) return { success: false, message: "Acesso negado." };
    const validatedFields = tagSchema.safeParse({ name: formData.get('name') });
    if (!validatedFields.success) return { success: false, message: validatedFields.error.issues[0].message };
    const { name } = validatedFields.data;
    const slug = generateSlug(name);

    const existingTag = await prisma.tag.findFirst({ where: { OR: [{ name }, { slug }] } });
    if (existingTag) return { success: false, message: "Uma tag com este nome ou slug já existe." };

    await prisma.tag.create({ data: { name, slug } });
    revalidatePath('/gestor/blog/tags');
    return { success: true, message: "Tag criada com sucesso!" };
  } catch (error) {
    console.error("Erro ao criar tag:", error);
    return { success: false, message: "Ocorreu um erro no servidor." };
  }
}

// --- ACTION 2: ATUALIZAR TAG ---
export async function updateTagAction(formData: FormData) {
  try {
    if (!(await canManageBlog())) return { success: false, message: "Acesso negado." };
    const tagId = formData.get('tagId') as string;
    const validatedFields = tagSchema.safeParse({ name: formData.get('name') });
    if (!validatedFields.success) return { success: false, message: validatedFields.error.issues[0].message };
    const { name } = validatedFields.data;
    const slug = generateSlug(name);

    await prisma.tag.update({ where: { id: tagId }, data: { name, slug } });
    revalidatePath('/gestor/blog/tags');
    return { success: true, message: "Tag atualizada com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar tag:", error);
    return { success: false, message: "Ocorreu um erro no servidor." };
  }
}

// --- ACTION 3: DELETAR TAG ---
export async function deleteTagAction(tagId: string) {
  try {
    if (!(await canManageBlog())) return { success: false, message: "Acesso negado." };
    await prisma.tag.delete({ where: { id: tagId } });
    revalidatePath('/gestor/blog/tags');
    return { success: true, message: "Tag deletada com sucesso." };
  } catch (error) {
    console.error("Erro ao deletar tag:", error);
    return { success: false, message: "Ocorreu um erro no servidor." };
  }
}