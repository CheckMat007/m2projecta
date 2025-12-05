// src/app/gestor/(admin)/projetos/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ProjectStatus } from '@prisma/client';

// Helper de segurança
async function canManageProjects() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;
  if (session.user.role === 'MASTER') return true;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { permissions: { select: { name: true } } }
  });
  return user?.permissions.some(p => p.name === 'manage_projects') || false;
}

const projectSchema = z.object({
  name: z.string().min(3, "O nome do projeto é obrigatório."),
  clientId: z.string().min(1, "Selecione um cliente."),
  contractId: z.string().optional(),
  serviceType: z.string().min(2, "O tipo de serviço é obrigatório."),
  deliveryDate: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
  downloadUrl: z.string().url("URL inválida.").optional().or(z.literal('')),
  observations: z.string().optional(),
  projectId: z.string().optional(),
});

const updateSchema = z.object({
  projectId: z.string(),
  title: z.string().min(3, "Título obrigatório"),
  description: z.string().min(3, "Descrição obrigatória"),
});

// Helper para traduzir status
const translateStatus = (status: ProjectStatus) => {
    const map = {
        BRIEFING: 'Planejamento',
        IN_PROGRESS: 'Em Andamento',
        REVIEW: 'Em Revisão',
        DONE: 'Concluído',
        PUBLISHED: 'Entregue/Publicado',
        CANCELLED: 'Cancelado'
    };
    return map[status] || status;
};

// --- ACTION: CRIAR OU ATUALIZAR PROJETO ---
export async function upsertProjectAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !(await canManageProjects())) return { success: false, message: "Acesso negado." };

    const rawData = Object.fromEntries(formData);
    if (rawData.contractId === 'none' || rawData.contractId === '') delete rawData.contractId;

    const validated = projectSchema.safeParse(rawData);
    if (!validated.success) return { success: false, message: validated.error.issues[0].message };

    const data = validated.data;
    const deliveryDate = data.deliveryDate ? new Date(data.deliveryDate) : null;

    if (data.projectId) {
      // Buscar projeto anterior para comparar status
      const oldProject = await prisma.project.findUnique({ 
          where: { id: data.projectId },
          include: { client: true } // Precisamos do cliente para notificar
      });

      const updatedProject = await prisma.project.update({
        where: { id: data.projectId },
        data: {
          name: data.name,
          clientId: data.clientId,
          contractId: data.contractId || null,
          serviceType: data.serviceType,
          deliveryDate: deliveryDate,
          status: data.status,
          downloadUrl: data.downloadUrl || null,
          observations: data.observations,
        },
        include: { client: true }
      });

      // --- LÓGICA DE ATUALIZAÇÃO AUTOMÁTICA ---
      if (oldProject && oldProject.status !== data.status) {
          const statusName = translateStatus(data.status);
          
          // 1. Criar registro na Timeline
          await prisma.projectUpdate.create({
              data: {
                  projectId: updatedProject.id,
                  title: `Status atualizado para ${statusName}`,
                  description: `O status do projeto mudou de "${translateStatus(oldProject.status)}" para "${statusName}".`,
                  createdById: session.user.id
              }
          });

          // 2. Criar Notificação para o Cliente
          // Busca o User ID associado ao Client
          if (updatedProject.client && updatedProject.client.userId) {
              const notification = await prisma.notification.create({
                  data: {
                      title: `Atualização no projeto: ${updatedProject.name}`,
                      message: `O status do seu projeto foi alterado para: ${statusName}.`,
                      senderId: session.user.id,
                  }
              });
              
              // Vincula a notificação ao usuário do cliente
              await prisma.userNotificationStatus.create({
                  data: {
                      userId: updatedProject.client.userId,
                      notificationId: notification.id,
                      isRead: false
                  }
              });
          }
      }

      revalidatePath('/gestor/projetos');
      return { success: true, message: "Projeto atualizado com sucesso!" };
    } else {
      // Criação (sem notificação de status change, pois é novo)
      await prisma.project.create({
        data: {
          name: data.name,
          clientId: data.clientId,
          contractId: data.contractId || null,
          serviceType: data.serviceType,
          deliveryDate: deliveryDate,
          status: data.status,
          downloadUrl: data.downloadUrl || null,
          observations: data.observations,
        }
      });
      revalidatePath('/gestor/projetos');
      return { success: true, message: "Projeto criado com sucesso!" };
    }
  } catch (error) {
    console.error("Erro ao salvar projeto:", error);
    return { success: false, message: "Erro interno no servidor." };
  }
}

export async function deleteProjectAction(projectId: string) {
    try {
        if (!(await canManageProjects())) return { success: false, message: "Acesso negado." };
        await prisma.project.delete({ where: { id: projectId } });
        revalidatePath('/gestor/projetos');
        return { success: true, message: "Projeto deletado." };
      } catch (error) {
        console.error(error); // <--- ADICIONE ISSO
        return { success: false, message: "Erro ao deletar." };
      }
}

// --- ATUALIZAÇÃO MANUAL (TIMELINE) ---
export async function createProjectUpdateAction(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || !(await canManageProjects())) {
        return { success: false, message: "Acesso negado." };
    }

    const validated = updateSchema.safeParse(Object.fromEntries(formData));
    if (!validated.success) return { success: false, message: validated.error.issues[0].message };

    const { projectId, title, description } = validated.data;

    // 1. Cria na timeline
    await prisma.projectUpdate.create({
      data: {
        projectId,
        title,
        description,
        createdById: session.user.id
      }
    });

    // 2. Notifica o Cliente
    const project = await prisma.project.findUnique({ 
        where: { id: projectId },
        include: { client: true }
    });

    if (project && project.client && project.client.userId) {
        const notification = await prisma.notification.create({
            data: {
                title: `Nova atualização em: ${project.name}`,
                message: `${title}: ${description}`,
                senderId: session.user.id,
            }
        });
        
        await prisma.userNotificationStatus.create({
            data: {
                userId: project.client.userId,
                notificationId: notification.id,
                isRead: false
            }
        });
    }

    revalidatePath('/gestor/projetos');
    return { success: true, message: "Atualização enviada para o cliente!" };
  } catch (error) {
    console.error("Erro ao criar update:", error);
    return { success: false, message: "Erro ao salvar atualização." };
  }
}

export async function deleteProjectUpdateAction(updateId: string) {
    try {
        if (!(await canManageProjects())) return { success: false, message: "Acesso negado." };
        await prisma.projectUpdate.delete({ where: { id: updateId } });
        revalidatePath('/gestor/projetos');
        return { success: true, message: "Atualização removida." };
      } catch (error) {
        console.error(error); // <--- ADICIONE ISSO
        return { success: false, message: "Erro ao remover." };
      }
}