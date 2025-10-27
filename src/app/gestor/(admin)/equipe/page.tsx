// src/app/gestor/(admin)/equipe/page.tsx
import { prisma } from "@/lib/prisma";
import { TeamClientPage } from "./_components/TeamClientPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// A função getTeamData continua a mesma, sem alterações.
async function getTeamData() {
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    include: { permissions: true },
  });
  const allPermissions = await prisma.permission.findMany();
  return { users, allPermissions };
}

export default async function TeamPage() {
  // 1. Buscar a sessão para identificar o usuário logado
  const session = await getServerSession(authOptions);

  // Segurança extra: se não há sessão, manda para o login
  if (!session?.user?.id) {
    redirect('/gestor/login');
  }

  // 2. Buscar os dados COMPLETOS do usuário logado, incluindo suas permissões
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { permissions: true },
  });

  // Se por algum motivo o usuário da sessão não existir no banco, redireciona
  if (!currentUser) {
    redirect('/gestor/login');
  }

  // 3. A NOVA LÓGICA DE PROTEÇÃO
  // Verifica se o usuário é MASTER OU se possui a permissão 'manage_team'
  const canAccessPage = 
    currentUser.role === 'MASTER' || 
    currentUser.permissions.some(permission => permission.name === 'manage_team');
  
  // Se ele não puder acessar, redireciona para o dashboard principal
  if (!canAccessPage) {
    redirect('/gestor');
  }
  
  // Se a verificação passar, a página continua a carregar normalmente
  const { users, allPermissions } = await getTeamData();

  return (
    <TeamClientPage users={users} allPermissions={allPermissions} />
  );
}