// src/app/cliente/(painel)/projetos/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Calendar, FileText, ArrowRight, Download } from 'lucide-react';
import { ProjectStatus } from '@prisma/client';

async function getClientProjects() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  // 1. Identificar o Cliente baseado no User
  const client = await prisma.client.findUnique({
    where: { userId: session.user.id }
  });

  if (!client) return null;

  // 2. Buscar projetos deste cliente
  const projects = await prisma.project.findMany({
    where: { clientId: client.id },
    orderBy: { updatedAt: 'desc' },
    include: {
      contract: { select: { contractNumber: true } }
    }
  });

  return projects;
}

const getStatusBadge = (status: ProjectStatus) => {
    switch(status) {
        case 'BRIEFING': return <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">Planejamento</Badge>;
        case 'IN_PROGRESS': return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20">Em Andamento</Badge>;
        case 'REVIEW': return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/20">Em Revisão</Badge>;
        case 'DONE': return <Badge variant="outline" className="bg-muted text-muted-foreground">Concluído</Badge>;
        case 'PUBLISHED': return <Badge className="bg-m2-green text-black hover:bg-m2-green/90 border-transparent">Entregue</Badge>;
        case 'CANCELLED': return <Badge variant="destructive">Cancelado</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}

export default async function ClientProjectsPage() {
  const projects = await getClientProjects();

  if (!projects) {
     redirect('/cliente/login');
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Projetos</h1>
        <p className="text-gray-500 dark:text-gray-400">Acompanhe o andamento de todos os seus serviços contratados.</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500">Você ainda não tem projetos cadastrados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 shadow-sm dark:shadow-none transition-colors flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    {getStatusBadge(project.status)}
                    {project.status === 'PUBLISHED' && project.downloadUrl && (
                        <Download size={18} className="text-m2-green" aria-label="Arquivos disponíveis" />
                    )}
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white line-clamp-1" title={project.name}>{project.name}</CardTitle>
                <CardDescription>{project.serviceType}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                 {project.contract && (
                     <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                        <FileText size={16} />
                        <span>Contrato: {project.contract.contractNumber}</span>
                     </div>
                 )}
                 {project.deliveryDate && (
                     <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                        <Calendar size={16} />
                        <span>Entrega: {format(new Date(project.deliveryDate), "dd/MM/yyyy")}</span>
                     </div>
                 )}
              </CardContent>
              <CardFooter className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button asChild className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white">
                    <Link href={`/cliente/projetos/${project.id}`}>
                        Ver Detalhes <ArrowRight size={16} className="ml-2" />
                    </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}