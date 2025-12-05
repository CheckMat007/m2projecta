// src/app/gestor/(admin)/clientes/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { ClientsClientPage } from './_components/ClientsClientPage';

// Helper de permissão
type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  // Verifica permissão 'manage_clients'
  if (!hasPermission(currentUser, 'manage_clients')) {
    redirect('/gestor');
  }

  // Busca os clientes e inclui os dados do usuário vinculado (para pegar o e-mail)
  const clients = await prisma.client.findMany({
    orderBy: { tradeName: 'asc' },
    include: {
      user: { select: { email: true, image: true } },
      contracts: { select: { id: true, fileUrl: true, contractNumber: true } } // <--- ADICIONE ISTO
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar Clientes</h1>
        <p className="text-gray-400">Cadastre empresas e gere acessos automáticos para a área do cliente.</p>
      </div>
      <ClientsClientPage initialClients={clients} />
    </div>
  );
}