// src/app/gestor/(admin)/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, FileText, DollarSign } from 'lucide-react';
import { DashboardCharts } from './_components/DashboardCharts'; // Componente de Gráfico
import { format } from 'date-fns';

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

  // 1. Total de Clientes
  const totalClients = await prisma.client.count();

  // 2. Projetos em Andamento (Exclui concluídos, publicados e cancelados)
  const activeProjects = await prisma.project.count({
    where: {
      status: {
        in: ['BRIEFING', 'IN_PROGRESS', 'REVIEW']
      }
    }
  });

  // 3. Contratos do Mês (Novos contratos gerados)
  const newContractsCount = await prisma.contract.count({
    where: {
      createdAt: { gte: firstDayOfMonth }
    }
  });

  // 4. Receita do Mês (Soma de contratos PAGOS atualizados este mês)
  const revenueAgg = await prisma.contract.aggregate({
    _sum: { value: true },
    where: {
      status: 'PAID',
      updatedAt: { gte: firstDayOfMonth } 
    }
  });
  const monthlyRevenue = revenueAgg._sum.value || 0;

  // 5. Timeline Global (últimas 10 atualizações de qualquer projeto)
  const globalTimeline = await prisma.projectUpdate.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
        project: { include: { client: { select: { tradeName: true } } } },
        createdBy: { select: { name: true } }
    }
  });

  // 6. Dados para o Gráfico (Receita Semestral - Contratos pagos recentes)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  
  const paidContracts = await prisma.contract.findMany({
      where: { 
          status: 'PAID',
          updatedAt: { gte: sixMonthsAgo }
      },
      select: { value: true, updatedAt: true }
  });

  return {
    totalClients,
    activeProjects,
    newContractsCount,
    monthlyRevenue,
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
  const firstName = session.user.name?.split(' ')[0] || 'Gestor';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Bem-vindo de volta, {firstName}!</p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Clientes Totais</CardTitle>
            <Users className="h-4 w-4 text-m2-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.totalClients}</div>
            <p className="text-xs text-gray-500">Base ativa de clientes</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Contratos (Mês)</CardTitle>
            <FileText className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.newContractsCount}</div>
            <p className="text-xs text-gray-500">Novos contratos este mês</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Projetos Ativos</CardTitle>
            <Briefcase className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.activeProjects}</div>
            <p className="text-xs text-gray-500">Em andamento ou revisão</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Receita (Mês)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatMoney(metrics.monthlyRevenue)}</div>
            <p className="text-xs text-gray-500">Pagamentos confirmados</p>
          </CardContent>
        </Card>
      </div>

      {/* Seção Inferior: Gráfico e Timeline */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Gráfico de Receita */}
        <Card className="col-span-4 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>Receita Semestral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <DashboardCharts contracts={metrics.paidContracts} />
          </CardContent>
        </Card>

        {/* Timeline Global */}
        <Card className="col-span-3 bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>Atualizações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8 relative border-l border-gray-800 ml-2 pl-6">
              {metrics.globalTimeline.map((update) => (
                <div key={update.id} className="relative">
                  <span className="absolute -left-[1.9rem] top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-gray-900" />
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                        <span className="text-xs text-m2-green font-bold">{update.project.client.tradeName}</span>
                        <span className="text-[10px] text-gray-500">{format(new Date(update.createdAt), "dd/MM HH:mm")}</span>
                    </div>
                    <p className="text-sm text-white font-medium">{update.project.name}</p>
                    <p className="text-xs text-gray-400">{update.title}</p>
                  </div>
                </div>
              ))}
              {metrics.globalTimeline.length === 0 && <p className="text-sm text-gray-500">Nenhuma atualização.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}