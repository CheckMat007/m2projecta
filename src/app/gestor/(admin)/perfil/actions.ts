// src/app/gestor/(admin)/perfil/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

const profileSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('Formato de e-mail inválido.'),
  phone: z.string().optional(),
  image: z.string().url('URL da imagem inválida.').optional(),
  jobDescription: z.string().optional(),
  showOnAboutPage: z.boolean(),
  personalQuote: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Usuário não autenticado.' };
  }

  const data = Object.fromEntries(formData);
  // O valor do switch vem como 'on' ou não existe. Convertemos para boolean.
  const parsedData = {
    ...data,
    showOnAboutPage: data.showOnAboutPage === 'on',
  };

  const validatedFields = profileSchema.safeParse(parsedData);
  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0]?.message || 'Dados do formulário inválidos.';
    return { success: false, message: errorMessage };
  }
  
  const { name, email, phone, image, jobDescription, showOnAboutPage, personalQuote } = validatedFields.data;

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!currentUser) {
      return { success: false, message: 'Usuário não encontrado.' };
    }

    const dataToUpdate: Partial<typeof currentUser> = {};
    if (name !== currentUser.name) dataToUpdate.name = name;
    if (email !== currentUser.email) dataToUpdate.email = email;
    if ((phone || null) !== currentUser.phone) dataToUpdate.phone = phone || null;
    if ((image || null) !== currentUser.image) dataToUpdate.image = image || null;
    if ((jobDescription || null) !== currentUser.jobDescription) dataToUpdate.jobDescription = jobDescription || null;
    if ((personalQuote || null) !== currentUser.personalQuote) dataToUpdate.personalQuote = personalQuote || null;
    if (session.user.role === 'MASTER') {
      if (showOnAboutPage !== currentUser.showOnAboutPage) {
        dataToUpdate.showOnAboutPage = showOnAboutPage;
      }
    }
    
    if (Object.keys(dataToUpdate).length === 0) {
      return { success: true, message: 'Nenhuma alteração detectada.' };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
    });

    revalidatePath('/gestor/perfil');
    revalidatePath('/sobre');
    return { success: true, message: 'Perfil atualizado com sucesso!' };

  } catch (error) {
    // ESTA É A VALIDAÇÃO EXISTENTE E CORRETA
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, message: 'Este e-mail já está em uso por outra conta.' };
    }
    console.error("Erro ao atualizar perfil:", error);
    return { success: false, message: 'Erro ao atualizar o perfil.' };
  }
}

const passwordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(10),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export async function updatePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Usuário não autenticado.' };
  }

  const validatedFields = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!validatedFields.success) {
    return { success: false, message: 'Dados inválidos ou as senhas não coincidem.' };
  }
  
  const { currentPassword, newPassword } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return { success: false, message: 'Usuário não encontrado.' };
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return { success: false, message: 'A senha atual está incorreta.' };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Senha alterada com sucesso!' };
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return { success: false, message: 'Erro ao alterar a senha.' };
  }
}