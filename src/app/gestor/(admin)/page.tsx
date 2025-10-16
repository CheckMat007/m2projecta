// src/app/gestor/(admin)/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Users, FileText, Calendar, TrendingUp, Info, PlusCircle, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectChart } from "./_components/ProjectChart";

// Componente para os cards de estatísticas (CORRIGIDO)
const StatCard = ({ title, value, change, icon: Icon }: { title: string, value: string, change: string, icon: React.ElementType }) => {
  return (
    <div className="bg-black/30 p-6 rounded-lg border border-gray-800 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <Icon className="w-5 h-5 text-gray-500" />
      </div>
      <div>
        <p className="text-4xl font-bold">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{change}</p>
      </div>
    </div>
  );
};

export default async function GestorPage() {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name?.split(' ')[0] || 'Gestor';

  const statsData = [
    { title: 'Clientes Ativos', value: '42', change: '+3 no último mês', icon: Users },
    { title: 'Contratos Fechados', value: '17', change: '+1 este mês', icon: FileText },
    { title: 'Agendamentos (Mês)', value: '8', change: '2 na próxima semana', icon: Calendar },
    { title: 'Receita (Mês)', value: 'R$ 7.850', change: '+15% vs. mês anterior', icon: TrendingUp },
  ];

  const recentActivities = [
    { icon: Users, text: 'Novo cliente "Construtora Alfa" cadastrado.', time: '2h atrás' },
    { icon: FileText, text: 'Nova mensagem de contato recebida.', time: '5h atrás' },
    { icon: Briefcase, text: 'Projeto "Edifício SkyTower" marcado como concluído.', time: 'Ontem' },
  ];

  const upcomingAppointments = [
    { date: '18/10', title: 'Reunião de briefing - Cliente Beta', time: '10:00' },
    { date: '21/10', title: 'Filmagem aérea - Evento MusicVibe', time: '14:00' },
    { date: '23/10', title: 'Apresentação de proposta - Imobiliária Gama', time: '11:00' },
  ];

  return (
    <div className="space-y-8">
      {/* Saudação e Aviso */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">Bem-vindo de volta, {userName}!</p>
      </div>
      <div className="bg-yellow-900/30 text-yellow-300 border border-yellow-400/20 p-4 rounded-md flex items-center gap-3">
        <Info size={20} />
        <p className="text-sm"><span className="font-semibold">Aviso:</span> Os dados exibidos são apenas exemplos para demonstração.</p>
      </div>

      {/* Grid de Cards com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      {/* Acesso Rápido */}
      <div className="flex flex-wrap items-center gap-4">
        <h3 className="text-lg font-semibold mr-4">Acesso Rápido:</h3>
        <Link href="/gestor/portfolio/novo"><Button className="bg-m2-green/90 text-black hover:bg-m2-green"><PlusCircle size={18} className="mr-2" /> Adicionar Portfólio</Button></Link>
        <Link href="/gestor/clientes/novo"><Button variant="outline" className="bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white"><PlusCircle size={18} className="mr-2" /> Cadastrar Cliente</Button></Link>
      </div>

      {/* Layout de duas colunas para Gráfico e Listas */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectChart />
        </div>
        <div className="space-y-6">
          <Card className="bg-black/30 border-gray-800 text-white">
            <CardHeader><CardTitle>Atividade Recente</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <li key={index} className="flex items-start gap-4 text-sm">
                    <activity.icon className="w-5 h-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300">{activity.text}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-black/30 border-gray-800 text-white">
            <CardHeader><CardTitle>Próximos Agendamentos</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {upcomingAppointments.map((appt, index) => (
                  <li key={index} className="flex items-center gap-4 text-sm">
                    <div className="bg-gray-800 p-2 rounded-md text-center">
                      <p className="font-bold text-m2-green">{appt.date.split('/')[0]}</p>
                      <p className="text-xs text-gray-400">{appt.date.split('/')[1]}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-200">{appt.title}</p>
                      <p className="text-xs text-gray-400">{appt.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}