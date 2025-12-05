// src/app/gestor/(admin)/contratos/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { ContractsClientPage } from './_components/ContractsClientPage';

type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

// A página recebe searchParams para pegar o ID do cliente caso venha do fluxo anterior
export default async function ContractsPage({ searchParams }: { searchParams: { newClientId?: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  if (!hasPermission(currentUser, 'manage_contracts')) {
    redirect('/gestor');
  }

  // Busca contratos existentes
  const contracts = await prisma.contract.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      client: { select: { tradeName: true } }
    }
  });

  // Busca todos os clientes para o seletor do formulário
  const clients = await prisma.client.findMany({
    orderBy: { tradeName: 'asc' },
    select: { id: true, tradeName: true }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Contratos</h1>
        <p className="text-gray-400">Crie e gerencie contratos comerciais.</p>
      </div>
      {/* Passamos o newClientId que pode vir da URL se viemos do cadastro de cliente */}
      <ContractsClientPage 
        initialContracts={contracts} 
        clients={clients} 
        preSelectedClientId={searchParams.newClientId}
      />
    </div>
  );
}