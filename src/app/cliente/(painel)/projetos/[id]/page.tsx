// src/app/cliente/(painel)/projetos/[id]/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Download, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { ProjectStatus } from '@prisma/client';

async function getProjectDetails(projectId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const client = await prisma.client.findUnique({
    where: { userId: session.user.id }
  });

  if (!client) return null;

  // Busca o projeto GARANTINDO que pertence a este cliente
  const project = await prisma.project.findFirst({
    where: { 
        id: projectId,
        clientId: client.id // Segurança: o projeto deve ser deste cliente
    },
    include: {
        contract: true,
        updates: {
            orderBy: { createdAt: 'desc' },
            include: {
                createdBy: { select: { name: true } }
            }
        }
    }
  });

  return project;
}

const getStatusBadge = (status: ProjectStatus) => {
    switch(status) {
        case 'BRIEFING': return <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-lg px-4 py-1">Planejamento</Badge>;
        case 'IN_PROGRESS': return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20 text-lg px-4 py-1">Em Andamento</Badge>;
        case 'REVIEW': return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/20 text-lg px-4 py-1">Em Revisão</Badge>;
        case 'DONE': return <Badge variant="outline" className="bg-muted text-muted-foreground text-lg px-4 py-1">Concluído</Badge>;
        case 'PUBLISHED': return <Badge className="bg-m2-green text-black hover:bg-m2-green/90 border-transparent text-lg px-4 py-1">Entregue</Badge>;
        case 'CANCELLED': return <Badge variant="destructive" className="text-lg px-4 py-1">Cancelado</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

export default async function ClientProjectDetailsPage({ params }: { params: { id: string } }) {
  const project = await getProjectDetails(params.id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <Link href="/cliente/projetos" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6">
          <ChevronLeft size={20} />
          Voltar para meus projetos
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{project.name}</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">{project.serviceType}</p>
            </div>
            <div>
                {getStatusBadge(project.status)}
            </div>
        </div>
      </div>

      {/* Área de Download (Se Publicado) */}
      {project.status === 'PUBLISHED' && project.downloadUrl && (
          <div className="bg-m2-green/10 border border-m2-green/30 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <CheckCircle2 className="text-m2-green" /> Projeto Finalizado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Seus arquivos finais estão prontos para download.</p>
              </div>
              <Button asChild className="bg-m2-green text-black hover:bg-m2-green/80 font-bold px-8 py-6 text-lg">
                  <a href={project.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-6 w-6" /> Baixar Arquivos
                  </a>
              </Button>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Coluna Esquerda: Informações */}
          <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
                  <CardHeader><CardTitle className="text-gray-900 dark:text-white">Detalhes</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      {project.deliveryDate && (
                        <div>
                            <span className="text-sm text-gray-500 block">Previsão de Entrega</span>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                                <Calendar size={16} className="text-m2-green" />
                                {format(new Date(project.deliveryDate), "dd/MM/yyyy")}
                            </div>
                        </div>
                      )}
                      {project.contract && (
                        <div>
                            <span className="text-sm text-gray-500 block">Contrato Vinculado</span>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                                <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                                {project.contract.contractNumber}
                            </div>
                            {project.contract.fileUrl && (
                                <a href={project.contract.fileUrl} target="_blank" className="text-xs text-blue-600 dark:text-blue-400 hover:underline block mt-1">
                                    Visualizar PDF
                                </a>
                            )}
                        </div>
                      )}
                  </CardContent>
              </Card>
          </div>

          {/* Coluna Direita: Timeline de Atualizações */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Histórico de Atualizações</h2>

            <div className="space-y-8 relative border-l border-gray-200 dark:border-gray-800 ml-3 pl-8 pb-4">

                {/* 1. PRIMEIRO: Renderiza os Updates (do mais recente para o mais antigo) */}
                {project.updates.map((update) => (
                    <div key={update.id} className="relative">
                        {/* ... (conteúdo do update igual ao que já existe) ... */}
                         <span className="absolute -left-[2.6rem] top-1 h-4 w-4 rounded-full bg-m2-green border-4 border-gray-50 dark:border-m2-dark shadow-[0_0_10px_rgba(163,230,53,0.3)]" />
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-mono">
                                {format(new Date(update.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                            </span>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{update.title}</h4>
                            <p className="text-gray-700 dark:text-gray-300 mt-2 bg-gray-100 dark:bg-gray-900/50 p-4 rounded-md border border-gray-200 dark:border-gray-800">
                                {update.description}
                            </p>
                            {update.createdBy && (
                                <p className="text-xs text-gray-500 dark:text-gray-600 mt-2">Atualizado por: {update.createdBy.name}</p>
                            )}
                        </div>
                    </div>
                ))}

                {/* 2. POR ÚLTIMO: O Evento de Criação (O início de tudo) */}
                <div className="relative">
                    <span className="absolute -left-[2.6rem] top-1 h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600" />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-mono">
                            {format(new Date(project.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                        </span>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Projeto Iniciado</h4>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">O projeto foi cadastrado em nosso sistema.</p>
                    </div>
                </div>

            </div>
          </div>

      </div>
    </div>
  );
}