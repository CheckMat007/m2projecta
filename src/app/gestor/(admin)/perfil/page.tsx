// src/app/gestor/(admin)/perfil/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./_components/ProfileForm";
import { redirect } from "next/navigation";

// Esta página agora é um Componente de Servidor
export default async function PerfilPage() {
  // Busca a sessão atual no servidor
  const session = await getServerSession(authOptions);

  // Se não houver sessão, redireciona para o login (segurança extra)
  if (!session?.user?.id) {
    redirect('/gestor/login');
  }

  // Busca os dados MAIS RECENTES do usuário diretamente do banco de dados
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  // Se o usuário não for encontrado no banco, redireciona
  if (!user) {
    redirect('/gestor/login');
  }

  // Renderiza o componente de formulário, passando os dados frescos como props
  return <ProfileForm user={user} />;
}