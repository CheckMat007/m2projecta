// src/app/gestor/(admin)/equipe/actions.ts
'use server';

import { z } from 'zod';
import { hash } from 'bcryptjs';
import { Role, Prisma } from '@prisma/client'; // 1. IMPORTAR 'Prisma'
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// --- HELPER DE SEGURANÇA ---
async function canManageTeam() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { can: false, session };

  if (session.user.role === 'MASTER') return { can: true, session };

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { permissions: { select: { name: true } } }
  });

  const hasPermission = user?.permissions.some(p => p.name === 'manage_team') || false;
  return { can: hasPermission, session };
}

// --- SCHEMAS DE VALIDAÇÃO (sem alterações) ---
const createUserSchema = z
  .object({
    name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    email: z.string().email('O e-mail fornecido é inválido.'),
    password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
    passwordConfirmation: z.string(),
    role: z.nativeEnum(Role),
    permissionIds: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'As senhas não coincidem.',
    path: ['passwordConfirmation'],
  });

const updateUserSchema = z.object({
  userId: z.string(),
  name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  email: z.string().email('O e-mail fornecido é inválido.'),
  role: z.nativeEnum(Role),
  permissionIds: z.array(z.string()).optional(),
});


// --- ACTIONS ATUALIZADAS ---

export async function createUserAction(formData: FormData) {
  try {
    const { can, session } = await canManageTeam();
    if (!can) return { success: false, message: 'Acesso negado.' };

    // ... (validação de dados)
    const dataToValidate = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      passwordConfirmation: formData.get('passwordConfirmation'),
      role: formData.get('role'),
      permissionIds: formData.getAll('permissionIds'),
    };
    const validatedFields = createUserSchema.safeParse(dataToValidate);
    if (!validatedFields.success) {
      return { success: false, message: validatedFields.error.issues[0].message };
    }
    const { name, email, password, role, permissionIds } = validatedFields.data;

    if (role === 'MASTER' && session?.user?.role !== 'MASTER') {
      return { success: false, message: 'Você não tem permissão para criar um usuário MASTER.' };
    }

    // A validação de e-mail duplicado na criação já existia e está correta
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: 'Este e-mail já está sendo utilizado por outra conta.' };
    }

    const hashedPassword = await hash(password, 12);
    await prisma.user.create({ 
      data: { name, email, password: hashedPassword, role, permissions: { connect: permissionIds?.map((id) => ({ id })) || [] } } 
    });
    
    revalidatePath('/gestor/equipe');
    return { success: true, message: 'Novo membro criado com sucesso!' };

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return { success: false, message: 'Ocorreu um erro no servidor.' };
  }
}

export async function updateUserAction(formData: FormData) {
  // 2. A CORREÇÃO PRINCIPAL ESTÁ AQUI
  try {
    const { can, session } = await canManageTeam();
    if (!can) return { success: false, message: 'Acesso negado.' };

    // ... (validação de dados)
    const formValues = {
      userId: formData.get('userId'),
      name: formData.get('name'),
      email: formData.get('email'),
      role: formData.get('role'),
      permissionIds: formData.getAll('permissionIds'),
    };
    const validatedFields = updateUserSchema.safeParse(formValues);
    if (!validatedFields.success) {
      return { success: false, message: validatedFields.error.issues[0].message };
    }
    const { userId, name, email, role, permissionIds } = validatedFields.data;
    
    // ... (regras de negócio de permissão)
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) return { success: false, message: 'Usuário não encontrado.' };
    if (targetUser.role === 'MASTER' && session?.user?.role !== 'MASTER') {
      return { success: false, message: 'Você não tem permissão para editar um usuário MASTER.' };
    }
    if (role === 'MASTER' && session?.user?.role !== 'MASTER') {
      return { success: false, message: 'Você não tem permissão para promover um usuário para MASTER.' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { name, email, role, permissions: { set: permissionIds?.map((id) => ({ id })) || [] } },
    });
    
    revalidatePath('/gestor/equipe');
    return { success: true, message: 'Usuário atualizado com sucesso!' };

  } catch (error) {
    // Captura o erro P2002 do Prisma se o e-mail já existir
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, message: 'Este e-mail já está em uso por outra conta.' };
    }
    console.error('Erro ao atualizar usuário:', error);
    return { success: false, message: 'Ocorreu um erro no servidor.' };
  }
}

// ... (as outras actions, delete e toggle, permanecem as mesmas)
export async function deleteUserAction(userId: string) {
  try {
    const { can, session } = await canManageTeam();
    if (!can) return { success: false, message: 'Acesso negado.' };
    
    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) return { success: false, message: 'Usuário não encontrado.' };

    if (targetUser.role === 'MASTER') {
      if (userId === session?.user?.id) {
        const masterCount = await prisma.user.count({ where: { role: 'MASTER' } });
        if (masterCount <= 1) {
          return { success: false, message: 'Você não pode se excluir pois é o único MASTER.' };
        }
      } else if (session?.user?.role !== 'MASTER') {
        return { success: false, message: 'Você não tem permissão para deletar um usuário MASTER.' };
      }
    }

    if (userId === session?.user?.id && targetUser.role !== 'MASTER') {
      return { success: false, message: 'Você não pode deletar a si mesmo.' };
    }

    await prisma.user.delete({ where: { id: userId } });
    
    revalidatePath('/gestor/equipe');
    return { success: true, message: 'Usuário deletado com sucesso!' };

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    return { success: false, message: 'Ocorreu um erro no servidor.' };
  }
}

export async function toggleShowOnAboutPageAction(userId: string, showOnAboutPage: boolean) {
  try {
    const { can } = await canManageTeam();
    if (!can) return { success: false, message: 'Acesso negado.' };

    await prisma.user.update({ where: { id: userId }, data: { showOnAboutPage } });

    revalidatePath('/gestor/equipe');
    revalidatePath('/sobre');

    return { success: true, message: 'Visibilidade do membro atualizada!' };
  } catch (error) {
    console.error('Erro ao alternar visibilidade:', error);
    return { success: false, message: 'Ocorreu um erro no servidor.' };
  }
}