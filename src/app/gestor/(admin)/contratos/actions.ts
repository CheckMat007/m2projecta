// src/app/gestor/(admin)/contratos/actions.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ContractStatus } from '@prisma/client';

// Helper de segurança
async function canManageContracts() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;
  if (session.user.role === 'MASTER') return true;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { permissions: { select: { name: true } } }
  });
  return user?.permissions.some(p => p.name === 'manage_contracts') || false;
}

// Função para gerar o número do contrato (M2-AAAA-NNN)
async function generateContractNumber() {
  const year = new Date().getFullYear();
  // Busca o último contrato criado neste ano para pegar a sequência
  const lastContract = await prisma.contract.findFirst({
    where: { contractNumber: { startsWith: `M2-${year}` } },
    orderBy: { createdAt: 'desc' },
  });

  let nextNumber = 1;
  if (lastContract) {
    const parts = lastContract.contractNumber.split('-');
    const lastSequence = parseInt(parts[2]);
    if (!isNaN(lastSequence)) {
      nextNumber = lastSequence + 1;
    }
  }

  // Formata com zeros à esquerda (001, 002, etc)
  const sequenceString = String(nextNumber).padStart(3, '0');
  return `M2-${year}-${sequenceString}`;
}

const contractSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente."),
  value: z.coerce.number().min(0, "O valor deve ser positivo."),
  status: z.nativeEnum(ContractStatus),
  fileUrl: z.string().optional(),
  observations: z.string().optional(),
  // Campos para edição
  contractId: z.string().optional(),
});

// --- ACTION: CRIAR OU ATUALIZAR CONTRATO ---
export async function upsertContractAction(formData: FormData) {
  try {
    if (!(await canManageContracts())) {
      return { success: false, message: "Acesso negado." };
    }

    const rawData = Object.fromEntries(formData);
    const validated = contractSchema.safeParse(rawData);

    if (!validated.success) {
      return { success: false, message: validated.error.issues[0].message };
    }

    const data = validated.data;

    // --- MODO EDIÇÃO ---
    if (data.contractId) {
      await prisma.contract.update({
        where: { id: data.contractId },
        data: {
          clientId: data.clientId,
          value: data.value,
          status: data.status,
          fileUrl: data.fileUrl,
          observations: data.observations,
        }
      });
      revalidatePath('/gestor/contratos');
      return { success: true, message: "Contrato atualizado com sucesso!" };
    } 
    
    // --- MODO CRIAÇÃO ---
    else {
      const contractNumber = await generateContractNumber();
      
      await prisma.contract.create({
        data: {
          contractNumber,
          clientId: data.clientId,
          value: data.value,
          status: data.status,
          fileUrl: data.fileUrl,
          observations: data.observations,
        }
      });

      revalidatePath('/gestor/contratos');
      return { success: true, message: "Contrato criado com sucesso!", isNew: true };
    }

  } catch (error) {
    console.error("Erro ao salvar contrato:", error);
    return { success: false, message: "Erro interno no servidor." };
  }
}

// --- ACTION: DELETAR CONTRATO ---
export async function deleteContractAction(contractId: string) {
    try {
        if (!(await canManageContracts())) {
            return { success: false, message: "Acesso negado." };
        }
        await prisma.contract.delete({ where: { id: contractId } });
        revalidatePath('/gestor/contratos');
        return { success: true, message: "Contrato deletado." };
      } catch (error) {
        console.error(error); // <--- ADICIONE ISSO
        return { success: false, message: "Erro ao deletar." };
      }
}