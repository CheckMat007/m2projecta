// src/app/gestor/(admin)/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Briefcase, FileText, DollarSign, Activity } from 'lucide-react';
import { DashboardCharts } from './_components/DashboardCharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função auxiliar de formatação
const formatMoney = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

async function getDashboardMetrics() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalClients, activeProjects, newContractsCount, revenueAgg, globalTimeline, paidContracts] = await Promise.all([
     prisma.client.count(),
     prisma.project.count({
        where: { status: { in: ['BRIEFING', 'IN_PROGRESS', 'REVIEW'] } }
     }),
     prisma.contract.count({
        where: { createdAt: { gte: firstDayOfMonth } }
     }),
     prisma.contract.aggregate({
        _sum: { value: true },
        where: { status: 'PAID', updatedAt: { gte: firstDayOfMonth } }
     }),
     prisma.projectUpdate.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
           project: { include: { client: { select: { tradeName: true } } } },
           createdBy: { select: { name: true } }
        }
     }),
     prisma.contract.findMany({
        where: { 
           status: 'PAID',
           updatedAt: { gte: new Date(new Date().setMonth(new Date().getMonth() - 5)) }
        },
        select: { value: true, updatedAt: true }
     })
  ]);

  return {
    totalClients,
    activeProjects,
    newContractsCount,
    monthlyRevenue: revenueAgg._sum.value || 0,
    globalTimeline,
    paidContracts
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/gestor/login');
  }

  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Cards de Métricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* ALTERAÇÃO: bg-white sólido ao invés de bg-white/50 */}
          <Card className="bg-white dark:bg-card border-gray-200 dark:border-border shadow-sm dark:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Clientes Totais</CardTitle>
            <Users className="h-4 w-4 text-green-600 dark:text-m2-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalClients}</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Base ativa de clientes</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-card border-gray-200 dark:border-border shadow-sm dark:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Contratos (Mês)</CardTitle>
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.newContractsCount}</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Novos contratos gerados</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Projetos Ativos</CardTitle>
            <Briefcase className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.activeProjects}</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Em andamento / revisão</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Receita (Mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatMoney(metrics.monthlyRevenue)}</div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Pagamentos confirmados</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção Inferior */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        
        {/* Gráfico */}
        <Card className="lg:col-span-4 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Receita Semestral</CardTitle>
            <CardDescription className="text-gray-500">Fluxo de pagamentos dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="px-auto py-12">
             <div className="h-[300px] w-full min-w-0">
               <DashboardCharts contracts={metrics.paidContracts} />
             </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="lg:col-span-3 bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none flex flex-col max-h-[450px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
               <Activity className="w-4 h-4 text-green-600 dark:text-m2-green" />
               Atualizações Recentes
            </CardTitle>
            <CardDescription className="text-gray-500">Últimas atividades nos projetos</CardDescription>
          </CardHeader>
          
          <CardContent className="overflow-hidden flex-1 p-0">
            <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 scrollbar-track-transparent px-6 pb-6">
              
              <div className="relative border-l border-gray-200 dark:border-gray-800 ml-2 space-y-6">
                {metrics.globalTimeline.map((update, index) => (
                  <div key={update.id || index} className="relative pl-6">
                    {/* Bolinha da Timeline */}
                    <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-white dark:bg-gray-900 border-2 border-blue-500 z-10" />
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-start w-full">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-green-700 dark:text-m2-green bg-green-100 dark:bg-m2-green/10 px-1.5 py-0.5 rounded">
                             {update.project.client.tradeName}
                          </span>
                          <time className="text-[10px] text-gray-400 dark:text-gray-500 tabular-nums whitespace-nowrap ml-2">
                             {format(new Date(update.createdAt), "dd MMM HH:mm", { locale: ptBR })}
                          </time>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-tight mt-1">
                         {update.project.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                         {update.title}
                         {update.createdBy?.name && <span className="text-gray-400 dark:text-gray-600"> • por {update.createdBy.name.split(' ')[0]}</span>}
                      </p>
                    </div>
                  </div>
                ))}

                {metrics.globalTimeline.length === 0 && (
                   <div className="pl-6 pt-4 text-sm text-gray-400 dark:text-gray-500 italic">
                      Nenhuma atualização recente.
                   </div>
                )}
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}