// src/app/gestor/(admin)/tutoriais/_data/dashboardSection.tsx
import { LayoutDashboard, Users, FileText, Briefcase, DollarSign } from 'lucide-react';
import { MockupFrame, MockCard } from '../_components/mockups/MockupFrame';
import { SectionIntro, FeatureList, PermissionNote } from '../_components/TutorialUI';
import type { TutorialSection } from './types';

function DashboardMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor" activeMenuIndex={0}>
      <h1 className="text-lg font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[
          { icon: Users, label: 'Clientes Totais', value: '24', color: 'text-m2-green' },
          { icon: FileText, label: 'Contratos (Mês)', value: '5', color: 'text-blue-500' },
          { icon: Briefcase, label: 'Projetos Ativos', value: '8', color: 'text-amber-500' },
          { icon: DollarSign, label: 'Receita (Mês)', value: 'R$ 12.4k', color: 'text-emerald-500' },
        ].map((stat, i) => (
          <MockCard key={i} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
            </div>
            <span className="text-lg font-bold">{stat.value}</span>
          </MockCard>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
        <MockCard className="lg:col-span-4 p-3 h-28">
          <span className="text-[11px] font-semibold">Receita Semestral</span>
          <div className="flex items-end gap-1.5 h-16 mt-2">
            {[40, 65, 45, 80, 55, 90].map((h, i) => (
              <div key={i} className="flex-1 bg-m2-green/70 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </MockCard>
        <MockCard className="lg:col-span-3 p-3 h-28 overflow-hidden">
          <span className="text-[11px] font-semibold">Atualizações Recentes</span>
          <div className="space-y-1.5 mt-2">
            {['GAMT — Roteiro aprovado', 'Studio X — Entrega agendada'].map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-m2-green shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </MockCard>
      </div>
    </MockupFrame>
  );
}

export const dashboardSection: TutorialSection = {
  id: 'dashboard',
  label: 'Dashboard',
  icon: LayoutDashboard,
  content: (
    <div>
      <SectionIntro>
        A tela inicial do painel — um raio-X do negócio em tempo real. É só leitura: não tem formulário
        nem botão de ação, serve para dar uma visão rápida antes de entrar nas áreas de gerenciamento.
      </SectionIntro>
      <PermissionNote />
      <FeatureList
        items={[
          <><strong>Clientes Totais</strong> — quantidade total de clientes cadastrados na base.</>,
          <><strong>Contratos (Mês)</strong> — quantos contratos foram criados desde o dia 1º do mês atual.</>,
          <><strong>Projetos Ativos</strong> — projetos com status Briefing, Em Andamento ou Em Revisão (ou seja, ainda não concluídos/publicados/cancelados).</>,
          <><strong>Receita (Mês)</strong> — soma do valor de contratos com status “Pago/Ativo” atualizados no mês corrente.</>,
          <><strong>Gráfico “Receita Semestral”</strong> — barras com a receita de contratos pagos mês a mês, últimos 6 meses.</>,
          <><strong>“Atualizações Recentes”</strong> — as 10 últimas atualizações de timeline lançadas em qualquer projeto (veja a aba Projetos), com cliente, data, título e quem lançou.</>,
        ]}
      />
      <DashboardMockup />
    </div>
  ),
};
