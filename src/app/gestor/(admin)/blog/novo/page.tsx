// src/app/gestor/(admin)/blog/novo/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import dynamic from 'next/dynamic';

// Helper de permissão
type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

const PostForm = dynamic(() =>
  import('../_components/PostForm').then(mod => mod.PostForm),
  { ssr: false }
);

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  if (!hasPermission(currentUser, 'manage_blog')) {
    redirect('/gestor');
  }

  // Busca tanto as categorias quanto as tags
  const allCategories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const allTags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-2">
      
      {/* Passa ambas as listas para o formulário */}
      <PostForm allCategories={allCategories} allTags={allTags} />
    </div>
  );
}