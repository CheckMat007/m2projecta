// src/app/gestor/(admin)/blog/editar/[id]/page.tsx
import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PostForm } from '../../_components/PostForm';

// Helper de permissão
type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

async function getData(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { categories: true, tags: true }
  });

  // Busca ambas as listas de taxonomia
  const allCategories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const allTags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });

  return { post, allCategories, allTags };
}

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  if (!hasPermission(currentUser, 'manage_blog')) {
    redirect('/gestor');
  }

  const { post, allCategories, allTags } = await getData(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-2">
      
      {/* Passa todos os dados necessários para o formulário */}
      <PostForm post={post} allCategories={allCategories} allTags={allTags} />
    </div>
  );
}