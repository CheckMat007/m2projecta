// src/app/gestor/(admin)/blog/tags/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import type { User, Permission } from '@prisma/client';
import { TagsClientPage } from './_components/TagsClientPage';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type UserWithPermissions = User & { permissions: Permission[] };
const hasPermission = (user: UserWithPermissions | null, permissionName: string): boolean => {
  if (!user) return false;
  if (user.role === 'MASTER') return true;
  return user.permissions?.some(p => p.name === permissionName);
};

export default async function TagsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');
  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id }, include: { permissions: true } });
  if (!hasPermission(currentUser, 'manage_blog')) redirect('/gestor');

  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-8">
        <div>
            <Link href="/gestor/blog" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4">
                <ChevronLeft size={20} />
                Voltar para o blog
            </Link>
            
        </div>
        <TagsClientPage initialTags={tags} />
    </div>
  );
}