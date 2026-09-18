// src/app/gestor/(admin)/site/aparencia/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { AppearanceForm } from "./_components/AppearanceForm"; // Criaremos este a seguir

// Helper de permissão
type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

// Busca os dados no servidor
async function getPageSettings() {
  // Busca a configuração da página 'ABOUT' ou cria se não existir
  let aboutSettings = await prisma.pageSettings.findUnique({
    where: { pageKey: "ABOUT" },
  });

  if (!aboutSettings) {
    aboutSettings = await prisma.pageSettings.create({
      data: {
        pageKey: "ABOUT",
        heroImageUrl: "/assets/portfolio/dutra.JPG", // Imagem padrão
      },
    });
  }
  return { aboutSettings };
}

export default async function AppearancePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  if (!hasPermission(currentUser, 'manage_site')) {
    redirect('/gestor');
  }

  const { aboutSettings } = await getPageSettings();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Gerenciar Aparência do Site</h1>
        <p className="text-muted-foreground">Edite os elementos visuais das páginas públicas.</p>
      </div>
      <Separator />
      
      {/* Passa os dados para o formulário cliente */}
      <AppearanceForm aboutSettings={aboutSettings} />
    </div>
  );
}