// src/app/gestor/(admin)/notifications/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';


// --- HELPER DE SEGURANÇA (manage_notifications) ---
async function canManageNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;
  if (session.user.role === 'MASTER') return true;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { permissions: { select: { name: true } } }
  });
  return user?.permissions.some(p => p.name === 'manage_notifications') || false;
}

// --- HELPER DE SEGURANÇA ---
// Verifica se o usuário logado tem permissão para ENVIAR notificações
async function canSendNotifications() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;
  if (session.user.role === 'MASTER') return true;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { permissions: { select: { name: true } } }
  });
  return user?.permissions.some(p => p.name === 'send_notifications') || false;
}

// --- SCHEMA DE VALIDAÇÃO (Zod) ---
// 'audience' substitui o antigo booleano 'isBroadcast' isolado, que só permitia
// "todo mundo" (na prática só a equipe via bell, já que o portal do cliente
// bloqueia broadcasts) ou uma lista manual sem distinção de tipo de usuário.
const sendNotificationSchema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres."),
  message: z.string().min(5, "A mensagem deve ter no mínimo 5 caracteres."),
  audience: z.enum(['STAFF', 'CLIENTS', 'ALL', 'CUSTOM']),
  recipientIds: z.array(z.string()).optional(),
}).refine(data => data.audience !== 'CUSTOM' ? true : !!data.recipientIds && data.recipientIds.length > 0, {
  message: "Selecione ao menos um destinatário.",
  path: ["recipientIds"],
});


// --- ACTION 1: ENVIAR UMA NOTIFICAÇÃO ---
export async function sendNotificationAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !(await canSendNotifications())) {
      return { success: false, message: "Você não tem permissão para enviar notificações." };
    }

    const recipientIds = formData.getAll('recipientIds').map(String);
    const data = {
      title: formData.get('title'),
      message: formData.get('message'),
      audience: formData.get('audience'),
      recipientIds,
    };

    const validatedFields = sendNotificationSchema.safeParse(data);
    if (!validatedFields.success) {
      return { success: false, message: validatedFields.error.issues[0].message };
    }

    const { title, message, audience } = validatedFields.data;
    const senderId = session.user.id;

    // 'STAFF' continua usando isBroadcast de verdade: fica visível para qualquer
    // usuário não-CLIENT, inclusive os que forem cadastrados depois do envio.
    // 'CLIENTS' e 'ALL' precisam de destinatários explícitos, porque o portal do
    // cliente nunca exibe notificações broadcast (ver getClientNotifications).
    // 'CUSTOM' usa a seleção manual, revalidada contra o banco por segurança.
    let isBroadcast = false;
    let finalRecipientIds: string[] = [];

    if (audience === 'STAFF') {
      isBroadcast = true;
    } else if (audience === 'CLIENTS') {
      const clients = await prisma.user.findMany({
        where: { role: 'CLIENT' },
        select: { id: true },
      });
      finalRecipientIds = clients.map(u => u.id);
    } else if (audience === 'ALL') {
      const everyone = await prisma.user.findMany({
        where: { id: { not: senderId } },
        select: { id: true },
      });
      finalRecipientIds = everyone.map(u => u.id);
    } else {
      // CUSTOM: revalida os ids recebidos contra usuários reais para evitar
      // linhas de status órfãs (e para não confiar cegamente no client).
      const validUsers = await prisma.user.findMany({
        where: { id: { in: recipientIds } },
        select: { id: true },
      });
      finalRecipientIds = validUsers.map(u => u.id);
      if (finalRecipientIds.length === 0) {
        return { success: false, message: "Nenhum destinatário válido selecionado." };
      }
    }

    // Usamos uma transação para garantir que ambas as operações (criar notificação e status) funcionem ou falhem juntas
    await prisma.$transaction(async (tx) => {
      const notification = await tx.notification.create({
        data: {
          title,
          message,
          senderId,
          isBroadcast,
        }
      });

      if (!isBroadcast && finalRecipientIds.length > 0) {
        const statusData = finalRecipientIds.map(userId => ({
          userId,
          notificationId: notification.id,
        }));
        await tx.userNotificationStatus.createMany({
          data: statusData,
          skipDuplicates: true,
        });
      }
    });

    // Revalida o cache do layout para que o sino de notificação seja atualizado para todos
    revalidatePath('/gestor', 'layout');
    revalidatePath('/cliente', 'layout');

    return { success: true, message: "Notificação enviada com sucesso!" };
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
    return { success: false, message: "Ocorreu um erro no servidor ao enviar a notificação." };
  }
}

// --- ACTION 2: MARCAR NOTIFICAÇÕES COMO LIDAS ---
export async function markNotificationsAsReadAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false };

    // Marca como lidas apenas as notificações direcionadas que ainda não foram lidas
    await prisma.userNotificationStatus.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      }
    });
    
    revalidatePath('/gestor', 'layout');
    return { success: true };
  } catch (error) {
    console.error("Erro ao marcar notificações como lidas:", error);
    return { success: false };
  }
}

// --- ACTION 3: BUSCAR AS NOTIFICAÇÕES PARA O SINO ---
export async function getNotificationsForBell() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { notifications: [], unreadCount: 0 };
  }

  // Busca as 10 notificações mais recentes que são:
  // 1. Para todos (isBroadcast)
  // OU
  // 2. Direcionadas especificamente para o usuário logado
  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { isBroadcast: true },
        { readStatuses: { some: { userId: session.user.id } } }
      ]
    },
    include: {
      sender: { select: { name: true } },
      // Traz apenas o status de leitura do usuário ATUAL
      readStatuses: {
        where: { userId: session.user.id }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  // Calcula a contagem de não lidas e formata os dados para a UI
  let unreadCount = 0;
  const formattedNotifications = notifications.map(n => {
    // Uma notificação é considerada não lida se:
    // 1. É para todos (broadcast) e NÃO existe um status de leitura para o usuário (ou seja, ele nunca a viu)
    // 2. É direcionada e o status de leitura é 'false'
    const isRead = n.readStatuses.length > 0 && n.readStatuses[0].isRead;
    if (!isRead) {
      unreadCount++;
    }
    return { ...n, isRead };
  });

  return { notifications: formattedNotifications, unreadCount };
}

export async function deleteNotificationAction(notificationId: string) {
  try {
    if (!(await canManageNotifications())) {
      return { success: false, message: "Você não tem permissão para gerenciar notificações." };
    }

    const session = await getServerSession(authOptions);
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      select: { senderId: true }
    });

    if (!notification) {
      return { success: false, message: "Notificação não encontrada." };
    }

    // REGRA DE NEGÓCIO: Um EDITOR só pode deletar as próprias notificações.
    if (session?.user.role !== 'MASTER' && notification.senderId !== session?.user.id) {
      return { success: false, message: "Você só pode deletar as notificações que você enviou." };
    }

    // Se as checagens passarem, deleta a notificação.
    // A deleção em cascata (`onDelete: Cascade` no schema) cuidará de remover as entradas em UserNotificationStatus.
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    revalidatePath('/gestor/notifications');
    revalidatePath('/gestor', 'layout'); // Revalida o layout para atualizar o sino, se necessário

    return { success: true, message: "Notificação deletada com sucesso." };
  } catch (error) {
    console.error("Erro ao deletar notificação:", error);
    return { success: false, message: "Ocorreu um erro no servidor ao deletar a notificação." };
  }
}

// --- NOVA ACTION: RECARREGAR AS NOTIFICAÇÕES PARA O SINO ---
export async function refreshNotificationsAction() {
  // Esta função reutiliza a lógica exata de getNotificationsForBell,
  // mas como uma action separada para ser chamada pelo cliente.
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { notifications: [], unreadCount: 0 };
  }

  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { isBroadcast: true },
        { readStatuses: { some: { userId: session.user.id } } }
      ]
    },
    include: {
      sender: { select: { name: true } },
      readStatuses: { where: { userId: session.user.id } }
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  let unreadCount = 0;
  const formattedNotifications = notifications.map(n => {
    const isRead = n.readStatuses.length > 0 && n.readStatuses[0].isRead;
    if (!isRead) {
      unreadCount++;
    }
    return { ...n, isRead };
  });

  return { notifications: formattedNotifications, unreadCount };
}

// --- NOVA ACTION: MARCAR UMA ÚNICA NOTIFICAÇÃO COMO LIDA ---
export async function markSingleNotificationAsReadAction(notificationId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, message: "Usuário não autenticado." };
    }
    const userId = session.user.id;

    // Usamos 'upsert' (update or insert). Esta é a lógica chave:
    // 1. Tenta ENCONTRAR um status de leitura para este usuário e notificação.
    // 2. Se ENCONTRAR, ele ATUALIZA 'isRead' para 'true'.
    // 3. Se NÃO ENCONTRAR (caso de uma notificação broadcast), ele CRIA um novo status já com 'isRead: true'.
    await prisma.userNotificationStatus.upsert({
      where: {
        userId_notificationId: {
          userId,
          notificationId,
        },
      },
      update: {
        isRead: true,
      },
      create: {
        userId,
        notificationId,
        isRead: true,
      },
    });

    // Revalida o layout para que, se o usuário atualizar a página, o estado de 'lida' persista.
    revalidatePath('/gestor', 'layout');

    return { success: true };
  } catch (error) {
    console.error("Erro ao marcar notificação única como lida:", error);
    return { success: false, message: "Erro no servidor." };
  }
}