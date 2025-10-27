// src/app/gestor/primeiro-acesso/actions.ts
'use server';

import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client'; // Importar tipos do Prisma

const passwordSchema = z.object({
  newPassword: z.string().refine(pass =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&=+#_])[A-Za-z\d@$!%*?&=+#_]{10,}$/.test(pass),
    "A senha não atende aos requisitos de segurança."
  ),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export async function updatePasswordFirstAccess(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: 'Sessão inválida.' };
    }

    const validatedFields = passwordSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
      return { success: false, message: validatedFields.error.issues[0].message };
    }
    
    const { newPassword } = validatedFields.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    if (!user) {
        return { success: false, message: "Usuário não encontrado." };
    }
    
    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return { success: false, message: 'A nova senha não pode ser igual à senha anterior.' };
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });

    return { success: true, message: 'Senha atualizada! Redirecionando...' };

  } catch (error) {
    // A MELHORIA ESTÁ AQUI
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("Erro de conexão com o banco de dados:", error);
      return { success: false, message: 'Não foi possível conectar ao banco de dados. Tente novamente mais tarde.' };
    }
    
    console.error("Erro inesperado ao atualizar senha:", error);
    return { success: false, message: 'Erro inesperado no servidor. Tente novamente.' };
  }
}