// src/app/gestor/(admin)/blog/categorias/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { CategoriesClientPage } from './_components/CategoriesClientPage'; // Vamos criar este a seguir
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

// Helper de segurança
type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  if (!hasPermission(currentUser, 'manage_blog')) redirect('/gestor');

  // Busca todas as categorias para exibir na tabela
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="space-y-8">
        <div>
            <Link href="/gestor/blog" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                <ChevronLeft size={20} />
                Voltar para o blog
            </Link>
            <h1 className="text-3xl font-bold">Gerenciar Categorias</h1>
            <p className="text-gray-400">Adicione, edite e organize as categorias do seu blog.</p>
        </div>
        <CategoriesClientPage initialCategories={categories} />
    </div>
  );
}