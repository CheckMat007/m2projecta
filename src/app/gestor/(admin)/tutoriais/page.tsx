// src/app/gestor/(admin)/tutoriais/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { TutorialsClientPage } from './_components/TutorialsClientPage';

export default async function TutoriaisPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/gestor/login');

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, permissions: { select: { name: true } } },
  });

  if (!currentUser) redirect('/gestor/login');

  return (
    <TutorialsClientPage
      userPermissions={{
        role: currentUser.role,
        permissionNames: currentUser.permissions.map((p) => p.name),
      }}
    />
  );
}
