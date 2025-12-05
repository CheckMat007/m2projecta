// src/app/gestor/(admin)/clientes/actions.ts
'use server';

import { z } from 'zod';
import { hash, compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';


// Helper de segurança
async function canManageClients() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;
  if (session.user.role === 'MASTER') return true;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { permissions: { select: { name: true } } }
  });
  return user?.permissions.some(p => p.name === 'manage_clients') || false;
}

// Schema de Validação
const clientSchema = z.object({
  tradeName: z.string().min(2, "Nome fantasia é obrigatório."),
  companyName: z.string().optional(),
  email: z.string().email("E-mail inválido."),
  cnpj: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  observations: z.string().optional(),
  logoUrl: z.string().optional(),
  
  // Campos para edição (opcionais na criação)
  clientId: z.string().optional(),
  userId: z.string().optional(),
  resetPassword: z.boolean().optional(), // Se true na edição, gera nova senha
});

// Função para gerar senha aleatória
function generateRandomPassword(length = 10) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$";
  let retVal = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

// --- ACTION: CRIAR OU ATUALIZAR CLIENTE ---
export async function upsertClientAction(formData: FormData) {
  try {
    if (!(await canManageClients())) {
      return { success: false, message: "Acesso negado." };
    }

    const rawData = Object.fromEntries(formData);
    const validated = clientSchema.safeParse({
      ...rawData,
      resetPassword: rawData.resetPassword === 'true'
    });

    if (!validated.success) {
      return { success: false, message: validated.error.issues[0].message };
    }

    const data = validated.data;
    let passwordGenerated = null;

    // --- MODO EDIÇÃO ---
    if (data.clientId && data.userId) {
      // Atualiza dados do Cliente
      await prisma.client.update({
        where: { id: data.clientId },
        data: {
          tradeName: data.tradeName,
          companyName: data.companyName,
          cnpj: data.cnpj,
          address: data.address,
          phone: data.phone,
          logoUrl: data.logoUrl,
          observations: data.observations,
        }
      });

      // Atualiza dados do Usuário (Email e/ou Senha)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateUserData: any = { email: data.email, name: data.tradeName };
      
      if (data.resetPassword) {
        passwordGenerated = generateRandomPassword();
        updateUserData.password = await hash(passwordGenerated, 12);
        updateUserData.mustChangePassword = true; // Força troca no primeiro login
      }

      await prisma.user.update({
        where: { id: data.userId },
        data: updateUserData
      });

      revalidatePath('/gestor/clientes');
      return { 
        success: true, 
        message: "Cliente atualizado com sucesso!", 
        credentials: passwordGenerated ? { email: data.email, password: passwordGenerated } : null 
      };
    } 
    
    // --- MODO CRIAÇÃO ---
    else {
      // Verifica se e-mail já existe
      const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingUser) {
        return { success: false, message: "Já existe um usuário com este e-mail." };
      }

      passwordGenerated = generateRandomPassword();
      const hashedPassword = await hash(passwordGenerated, 12);

      // Cria Usuário e Cliente em uma transação para garantir integridade
      await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            name: data.tradeName,
            email: data.email,
            password: hashedPassword,
            role: 'CLIENT',
            mustChangePassword: true,
            image: data.logoUrl,
          }
        });

        await tx.client.create({
          data: {
            tradeName: data.tradeName,
            companyName: data.companyName,
            cnpj: data.cnpj,
            address: data.address,
            phone: data.phone,
            logoUrl: data.logoUrl,
            observations: data.observations,
            userId: newUser.id,
          }
        });
      });

      revalidatePath('/gestor/clientes');
      return { 
        success: true, 
        message: "Cliente cadastrado com sucesso!", 
        credentials: { email: data.email, password: passwordGenerated },
        isNew: true // Flag para saber se devemos mostrar o popup de "Próximo Passo"
      };
    }

  } catch (error) {
    console.error("Erro ao salvar cliente:", error);
    return { success: false, message: "Erro interno no servidor." };
  }
}

// --- ACTION: DELETAR CLIENTE ---
// --- ACTION: DELETAR CLIENTE COM CONFIRMAÇÃO ---
export async function deleteClientAction(clientId: string, passwordConfirm: string) {
  try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id || !(await canManageClients())) {
          return { success: false, message: "Acesso negado." };
      }

      // 1. Verificar senha do gestor
      const gestor = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!gestor) return { success: false, message: "Usuário inválido." };

      const isPasswordValid = await compare(passwordConfirm, gestor.password);
      if (!isPasswordValid) {
          return { success: false, message: "Senha incorreta. A exclusão foi cancelada." };
      }

      // 2. Buscar o userId associado para deletar o usuário de login também
      const client = await prisma.client.findUnique({ where: { id: clientId } });
      if (!client) return { success: false, message: "Cliente não encontrado." };

      // 3. Deletar (O cascade cuidará dos contratos e projetos, e devemos deletar o User também)
      // Primeiro deletamos o cliente
      await prisma.client.delete({ where: { id: clientId } });
      
      // Depois deletamos o usuário de login associado
      await prisma.user.delete({ where: { id: client.userId } });

      revalidatePath('/gestor/clientes');
      return { success: true, message: "Cliente e todos os dados vinculados foram excluídos." };

  } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      return { success: false, message: "Erro ao excluir. Verifique se existem dependências." };
  }
}