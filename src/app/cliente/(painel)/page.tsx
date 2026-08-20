// src/app/cliente/(painel)/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProjectStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';

async function getClientDashboardData(userId: string) {
  // 1. Busca o perfil do cliente vinculado ao usuário
  const clientProfile = await prisma.client.findUnique({
    where: { userId },
    include: {
        // Busca os 3 projetos mais recentes
        projects: {
            orderBy: { updatedAt: 'desc' },
            take: 3,
            include: {
                contract: { select: { contractNumber: true } }
            }
        }
    }
  });

  if (!clientProfile) return null;

  // 2. Busca as últimas atualizações de TODOS os projetos desse cliente
  const recentUpdates = await prisma.projectUpdate.findMany({
    where: {
        project: { clientId: clientProfile.id }
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: {
        project: { select: { name: true } }
    }
  });

  return { clientProfile, recentUpdates };
}

const getStatusBadge = (status: ProjectStatus) => {
    switch(status) {
        case 'BRIEFING': return <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">Planejamento</Badge>;
        case 'IN_PROGRESS': return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20">Em Andamento</Badge>;
        case 'REVIEW': return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/20">Revisão</Badge>;
        case 'DONE': return <Badge variant="outline" className="bg-muted text-muted-foreground">Concluído</Badge>;
        case 'PUBLISHED': return <Badge className="bg-m2-green text-black hover:bg-m2-green/90 border-transparent">Entregue</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

export default async function ClientDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/cliente/login');

  const data = await getClientDashboardData(session.user.id);

  if (!data || !data.clientProfile) {
    return <div className="p-8 text-center text-gray-500">Perfil de cliente não encontrado. Contate o suporte.</div>;
  }

  const { clientProfile, recentUpdates } = data;
  const firstName = session?.user.name?.split(' ')[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header de Boas-vindas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Olá, {firstName}</h1>
            <p className="text-gray-500 dark:text-gray-400">Acompanhe o progresso dos seus projetos em tempo real.</p>
        </div>
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
                <span className="text-m2-green font-bold text-lg">{clientProfile.projects.length}</span>
                Projetos Ativos
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA DA ESQUERDA: PROJETOS RECENTES */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Projetos Recentes</h2>
                <Link href="/cliente/projetos" className="text-sm text-m2-green hover:underline flex items-center">
                    Ver todos <ArrowRight size={16} className="ml-1" />
                </Link>
            </div>

            <div className="grid gap-4">
                {clientProfile.projects.map(project => (
                    <Card key={project.id} className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow-sm dark:shadow-none transition-colors">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">{project.name}</CardTitle>
                                {getStatusBadge(project.status)}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-end">
                                <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                                    <p>Serviço: {project.serviceType}</p>
                                    {project.contract && <p>Contrato: {project.contract.contractNumber}</p>}
                                    {project.deliveryDate && <p>Previsão: {format(new Date(project.deliveryDate), 'dd/MM/yyyy')}</p>}
                                </div>
                                <Link href={`/cliente/projetos/${project.id}`}>
                                    <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800">
                                        Detalhes
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {clientProfile.projects.length === 0 && (
                    <div className="p-8 border border-dashed border-gray-300 dark:border-gray-800 rounded-lg text-center text-gray-500">
                        Nenhum projeto iniciado ainda.
                    </div>
                )}
            </div>
        </div>

        {/* COLUNA DA DIREITA: TIMELINE DE ATUALIZAÇÕES */}
        <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Últimas Atualizações</h2>
            <div className="relative border-l border-gray-200 dark:border-gray-800 ml-3 space-y-8 pl-6 pb-4">
                {recentUpdates.map((update) => (
                    <div key={update.id} className="relative">
                        <span className="absolute -left-[2.4rem] top-1 h-3 w-3 rounded-full bg-m2-green border-4 border-gray-50 dark:border-m2-dark" />
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-500">
                                {format(new Date(update.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                            </span>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{update.title}</h4>
                            <p className="text-xs text-m2-green/80 mb-1">{update.project.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{update.description}</p>
                        </div>
                    </div>
                ))}
                 {recentUpdates.length === 0 && (
                    <p className="text-sm text-gray-500 italic">Nenhuma atualização recente.</p>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}