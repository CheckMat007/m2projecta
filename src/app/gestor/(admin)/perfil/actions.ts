// src/app/gestor/(admin)/perfil/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client'; // Importa o Prisma para tipagem de erro

// Validação dos dados do perfil com Zod
const profileSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('Formato de e-mail inválido.'),
  phone: z.string().optional(),
  image: z.string().url('URL da imagem inválida.').optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, message: 'Usuário não autenticado.' };
  }

  // 1. Valida os dados recebidos do formulário
  const validatedFields = profileSchema.safeParse(Object.fromEntries(formData));
  if (!validatedFields.success) {
    return { success: false, message: 'Dados do formulário inválidos.' };
  }
  const { name, email, phone, image } = validatedFields.data;

  try {
    // 2. Busca os dados atuais do usuário no banco
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser) {
      return { success: false, message: 'Usuário não encontrado.' };
    }

    // 3. Compara os campos e constrói o objeto de atualização
    const dataToUpdate: Partial<typeof currentUser> = {};

    if (name !== currentUser.name) {
      dataToUpdate.name = name;
    }
    if (email !== currentUser.email) {
      dataToUpdate.email = email;
    }
    // Normaliza strings vazias para null para comparar com o banco
    const newPhone = phone || null;
    if (newPhone !== currentUser.phone) {
      dataToUpdate.phone = newPhone;
    }
    const newImage = image || null;
    if (newImage !== currentUser.image) {
      dataToUpdate.image = newImage;
    }
    
    // 4. Se não houver nada para atualizar, retorna com sucesso
    if (Object.keys(dataToUpdate).length === 0) {
      return { success: true, message: 'Nenhuma alteração detectada.' };
    }

    // 5. Se houver, atualiza apenas os campos alterados
    await prisma.user.update({
      where: { id: session.user.id },
      data: dataToUpdate,
    });

    revalidatePath('/gestor/perfil');
    return { success: true, message: 'Perfil atualizado com sucesso!' };

  } catch (error) {
    // Trata erros específicos, como e-mail duplicado
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, message: 'Este e-mail já está em uso por outra conta.' };
    }
    console.error("Erro ao atualizar perfil:", error);
    return { success: false, message: 'Erro ao atualizar o perfil.' };
  }
}

// Validação dos dados de senha
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