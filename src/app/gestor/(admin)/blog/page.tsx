// src/app/gestor/(admin)/blog/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { BlogClientPage } from './_components/BlogClientPage'; // Vamos criar este a seguir

// Helper para verificar permissões
type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

export default async function BlogPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/gestor/login');
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  // 1. Protege a rota: só pode acessar quem tiver a permissão 'manage_blog'
  if (!hasPermission(currentUser, 'manage_blog')) {
    redirect('/gestor');
  }

  // 2. Busca todos os posts do banco de dados para exibir na tabela
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true } },
      categories: { select: { name: true } },
    },
  });

  return (
    <BlogClientPage initialPosts={posts} />
  );
}