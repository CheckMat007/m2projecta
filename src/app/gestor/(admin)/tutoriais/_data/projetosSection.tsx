// src/app/gestor/(admin)/tutoriais/_data/projetosSection.tsx
import { Briefcase, History, Calendar } from 'lucide-react';
import { MockupFrame, MockCard, MockButton, MockBadge } from '../_components/mockups/MockupFrame';
import { SectionIntro, FeatureList, PermissionNote, WarningBox, TipBox, SubHeading } from '../_components/TutorialUI';
import type { TutorialSection } from './types';

function ProjetosMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor/projetos" activeMenuIndex={6}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Projetos</h1>
        <MockButton>Novo Projeto</MockButton>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'Arraia do GAMT — Cobertura', client: 'GAMT Eventos', status: 'blue', statusLabel: 'Em Andamento' },
          { name: 'Tour Virtual 360°', client: 'Studio X', status: 'green', statusLabel: 'Publicado' },
        ].map((p, i) => (
          <MockCard key={i} className="p-3">
            <div className="flex items-start justify-between mb-2">
              <span className="text-[11px] font-semibold leading-tight">{p.name}</span>
              <MockBadge tone={p.status as 'blue' | 'green'}>{p.statusLabel}</MockBadge>
            </div>
            <span className="text-[10px] text-muted-foreground block mb-2">{p.client}</span>
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              <div className="bg-muted/40 rounded px-1.5 py-1 text-[9px] flex items-center gap-1"><Calendar size={9} />28/06</div>
              <div className="bg-muted/40 rounded px-1.5 py-1 text-[9px]">Cobertura</div>
            </div>
            <MockButton variant="outline"><History size={10} /> Timeline (3)</MockButton>
          </MockCard>
        ))}
      </div>
    </MockupFrame>
  );
}

export const projetosSection: TutorialSection = {
  id: 'projetos',
  label: 'Projetos',
  icon: Briefcase,
  permission: 'manage_projects',
  content: (
    <div>
      <SectionIntro>
        Acompanhamento dos serviços em execução — é o que o cliente vê refletido no Portal do Cliente,
        incluindo a linha do tempo de atualizações.
      </SectionIntro>
      <PermissionNote permission="manage_projects" />
      <FeatureList
        items={[
          <>Cada card mostra nome do projeto, cliente, status colorido, previsão de entrega e tipo de serviço.</>,
          <><strong>Novo Projeto</strong> — escolhe Cliente, opcionalmente um Contrato já cadastrado desse cliente pra vincular, Tipo de Serviço (vem da lista de Serviços), Previsão de Entrega, Status e Observações internas.</>,
          <>Quando o Status muda para <strong>Publicado</strong>, aparece um campo extra pra colar o <strong>Link para Download</strong> — é esse link que o cliente vê liberado no portal dele.</>,
          <>Trocar o status de um projeto já existente <strong>gera automaticamente</strong> uma entrada na timeline e uma notificação pro cliente avisando da mudança.</>,
        ]}
      />
      <SubHeading>Timeline de atualizações</SubHeading>
      <FeatureList
        items={[
          <>Clique em <strong>“Timeline (N)”</strong> no card do projeto pra abrir o histórico daquele projeto específico.</>,
          <>Lá dentro: a lista de atualizações já lançadas (com quem lançou e quando) e, embaixo, um formulário fixo pra lançar uma nova — Título + Descrição, com um botão de enviar.</>,
          <>Cada atualização manual também <strong>notifica o cliente</strong> automaticamente.</>,
        ]}
      />
      <WarningBox>
        Diferente de quase todo o resto do painel, excluir um projeto ou uma atualização de timeline{' '}
        <strong>não pede confirmação</strong> — a exclusão acontece na hora do clique. Cuidado ao usar o ícone de lixeira aqui.
      </WarningBox>
      <TipBox>
        Não existe uma página separada de “detalhes do projeto” — tudo (editar, excluir, timeline) acontece em
        janelas que abrem por cima da própria listagem de cards.
      </TipBox>
      <ProjetosMockup />
    </div>
  ),
};
