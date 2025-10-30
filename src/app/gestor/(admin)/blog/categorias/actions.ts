// src/app/gestor/(admin)/blog/categorias/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Helper de Segurança (reutilizado)
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

// Helper para gerar slugs (reutilizado)
function generateSlug(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

// Schema de validação
const categorySchema = z.object({
  name: z.string().min(2, "O nome da categoria é muito curto."),
});

// --- ACTION 1: CRIAR CATEGORIA ---
export async function createCategoryAction(formData: FormData) {
  try {
    if (!(await canManageBlog())) {
      return { success: false, message: "Acesso negado." };
    }
    const validatedFields = categorySchema.safeParse({ name: formData.get('name') });
    if (!validatedFields.success) {
      return { success: false, message: validatedFields.error.issues[0].message };
    }
    const { name } = validatedFields.data;
    const slug = generateSlug(name);

    const existingCategory = await prisma.category.findFirst({ where: { OR: [{ name }, { slug }] } });
    if (existingCategory) {
      return { success: false, message: "Uma categoria com este nome ou slug já existe." };
    }

    await prisma.category.create({ data: { name, slug } });
    revalidatePath('/gestor/blog/categorias');
    return { success: true, message: "Categoria criada com sucesso!" };

  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return { success: false, message: "Ocorreu um erro no servidor." };
  }
}

// --- ACTION 2: ATUALIZAR CATEGORIA ---
export async function updateCategoryAction(formData: FormData) {
  try {
    if (!(await canManageBlog())) {
      return { success: false, message: "Acesso negado." };
    }
    const categoryId = formData.get('categoryId') as string;
    const validatedFields = categorySchema.safeParse({ name: formData.get('name') });
    if (!validatedFields.success) {
      return { success: false, message: validatedFields.error.issues[0].message };
    }
    const { name } = validatedFields.data;
    const slug = generateSlug(name);

    await prisma.category.update({
      where: { id: categoryId },
      data: { name, slug },
    });
    revalidatePath('/gestor/blog/categorias');
    return { success: true, message: "Categoria atualizada com sucesso!" };
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return { success: false, message: "Ocorreu um erro no servidor." };
  }
}

// --- ACTION 3: DELETAR CATEGORIA ---
export async function deleteCategoryAction(categoryId: string) {
  try {
    if (!(await canManageBlog())) {
      return { success: false, message: "Acesso negado." };
    }
    await prisma.category.delete({ where: { id: categoryId } });
    revalidatePath('/gestor/blog/categorias');
    return { success: true, message: "Categoria deletada com sucesso." };
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return { success: false, message: "Ocorreu um erro no servidor." };
  }
}