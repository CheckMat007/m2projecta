// src/app/cliente/(painel)/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Toaster } from "@/components/ui/sonner";
import { ClientLayoutClient } from '../_components/ClientLayoutClient';
import { getClientNotifications } from '../actions';

export default async function ClientPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'CLIENT') redirect('/cliente/login');

  // 1. BUSCAR DADOS FRESCOS DO CLIENTE
  const clientData = await prisma.client.findUnique({
    where: { userId: session.user.id },
    select: { 
      tradeName: true, 
      logoUrl: true, 
      // CORREÇÃO AQUI: Buscamos o email através da relação 'user'
      user: {
        select: { email: true }
      }
    } 
  });

  // Monta o objeto de exibição com os dados frescos
  const userDisplay = {
    name: clientData?.tradeName || session.user.name || 'Cliente',
    // CORREÇÃO AQUI: Acessamos o email aninhado
    email: clientData?.user?.email || session.user.email,
    image: clientData?.logoUrl || session.user.image,
  };

  const { notifications, unreadCount } = await getClientNotifications();

  return (
    <div className="min-h-screen bg-m2-dark text-white">
      <ClientLayoutClient 
        user={userDisplay}
        initialNotifications={notifications}
        initialUnreadCount={unreadCount}
      >
        {children}
      </ClientLayoutClient>
      <Toaster richColors theme="dark" />
    </div>
  );
}