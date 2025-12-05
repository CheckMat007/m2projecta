// src/app/cliente/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs'; // Certifique-se de importar o bcrypt no topo
import { z } from 'zod'; // Certifique-se de importar o z

// --- BUSCAR NOTIFICAÇÕES DO CLIENTE ---
export async function getClientNotifications() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'CLIENT') {
    return { notifications: [], unreadCount: 0 };
  }

  // A CORREÇÃO DEFINITIVA:
  const notifications = await prisma.notification.findMany({
    where: {
      // 1. REGRA DE OURO: O cliente NUNCA vê notificações globais (Broadcast)
      isBroadcast: false, 
      
      // 2. Ele só vê notificações explicitamente vinculadas a ele (Status de Projeto, Timeline, etc.)
      readStatuses: { some: { userId: session.user.id } }
    },
    include: {
      sender: { select: { name: true } },
      readStatuses: {
        where: { userId: session.user.id }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  let unreadCount = 0;
  const formattedNotifications = notifications.map(n => {
    const isRead = n.readStatuses.length > 0 && n.readStatuses[0].isRead;
    if (!isRead) {
      unreadCount++;
    }
    return { 
      id: n.id, 
      title: n.title, 
      message: n.message, 
      createdAt: n.createdAt, 
      sender: n.sender,
      isRead 
    };
  });

  return { notifications: formattedNotifications, unreadCount };
}

// --- MARCAR TODAS COMO LIDAS ---
export async function markClientNotificationsAsRead() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'CLIENT') return { success: false };

  try {
    // Atualiza apenas as notificações que pertencem a este usuário
    // A query interna do updateMany não permite filtrar por relação da notificação pai (isBroadcast),
    // mas como o cliente só "vê" e cria status para as dele, isso deve ser seguro.
    await prisma.userNotificationStatus.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true }
    });
    
    revalidatePath('/cliente', 'layout');
    return { success: true };
  } catch (error) {
    console.error(error); // <--- ADICIONE ISSO
    return { success: false };
  }
}

// --- MARCAR UMA COMO LIDA ---
export async function markSingleClientNotificationAsRead(notificationId: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'CLIENT') return { success: false };

  try {
    await prisma.userNotificationStatus.update({
      where: {
        userId_notificationId: {
          userId: session.user.id,
          notificationId,
        },
      },
      data: { isRead: true },
    });

    revalidatePath('/cliente', 'layout');
    return { success: true };
  } catch (error) {
    console.error(error); // <--- ADICIONE ISSO
    return { success: false };
  }
}

// --- RECARREGAR ---
export async function refreshClientNotifications() {
    return await getClientNotifications();
}

const passwordSchema = z.object({
    currentPassword: z.string(),
    newPassword: z.string().min(10, "A senha deve ter no mínimo 10 caracteres."),
    confirmPassword: z.string(),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });
  
  export async function updateClientPasswordAction(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'CLIENT') {
      return { success: false, message: "Acesso negado." };
    }
  
    const validated = passwordSchema.safeParse(Object.fromEntries(formData));
    if (!validated.success) {
      return { success: false, message: validated.error.issues[0].message };
    }
    
    const { currentPassword, newPassword } = validated.data;
  
    try {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user) return { success: false, message: "Usuário não encontrado." };
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return { success: false, message: "A senha atual está incorreta." };
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword }
      });
  
      return { success: true, message: "Senha atualizada com sucesso!" };
    } catch (error) {
      console.error(error); // <--- ADICIONE ISSO
      return { success: false, message: "Erro ao atualizar senha." };
    }
  }