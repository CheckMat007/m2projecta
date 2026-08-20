// src/app/cliente/(painel)/perfil/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { ClientProfileForm } from './_components/ClientProfileForm';

export default async function ClientProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/cliente/login');

  // Busca os dados do cliente e do usuário
  const clientData = await prisma.client.findUnique({
    where: { userId: session.user.id },
    include: { user: true }
  });

  if (!clientData) {
    return <div>Erro ao carregar perfil.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meu Perfil</h1>
        <p className="text-gray-500 dark:text-gray-400">Visualize seus dados cadastrais e gerencie sua segurança.</p>
      </div>
      
      <ClientProfileForm client={clientData} />
    </div>
  );
}