// src/app/gestor/(admin)/tutoriais/_data/clientesSection.tsx
import { Users, Mail, MessageCircle } from 'lucide-react';
import { MockupFrame, MockCard, MockButton } from '../_components/mockups/MockupFrame';
import { SectionIntro, FeatureList, PermissionNote, TipBox, WarningBox } from '../_components/TutorialUI';
import type { TutorialSection } from './types';

function ClientesMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor/clientes" activeMenuIndex={4}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Gerenciar Clientes</h1>
        <MockButton>Novo Cliente</MockButton>
      </div>
      <MockCard className="overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-2 text-[10px] font-semibold text-muted-foreground border-b border-border bg-muted/40">
          <span>Empresa / Cliente</span><span>Contato</span><span>Acesso</span><span>Ações</span>
        </div>
        {[
          { name: 'GAMT Eventos', phone: '(12) 99999-0000' },
          { name: 'Studio X Imóveis', phone: '(12) 98888-1111' },
        ].map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-2.5 text-[11px] items-center border-b border-border last:border-0">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted/60 shrink-0" />
              <span className="font-medium truncate">{c.name}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-[10px]"><MessageCircle size={10} />{c.phone}</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground text-[10px]"><Mail size={10} />contato@email.com</span>
            <span className="text-muted-foreground">✏️ 🗑️</span>
          </div>
        ))}
      </MockCard>
    </MockupFrame>
  );
}

export const clientesSection: TutorialSection = {
  id: 'clientes',
  label: 'Clientes',
  icon: Users,
  permission: 'manage_clients',
  content: (
    <div>
      <SectionIntro>
        Cadastro das empresas/clientes atendidos — e é aqui que se cria o acesso deles ao Portal do Cliente
        (área separada, fora deste painel).
      </SectionIntro>
      <PermissionNote permission="manage_clients" />
      <FeatureList
        items={[
          <><strong>Novo Cliente</strong> — pede Nome Fantasia e E-mail de Acesso (obrigatórios), Razão Social, CNPJ/CPF, WhatsApp, Endereço, Observações internas e a logomarca do cliente.</>,
          <>Ao criar, uma <strong>senha provisória</strong> é gerada automaticamente e mostrada numa tela de confirmação — dá pra copiar tudo (login + senha) num texto pronto pra colar no WhatsApp, ou já seguir direto para criar um Contrato pra esse cliente.</>,
          <>Na edição, existe a opção <strong>“Redefinir Credenciais”</strong> — marque essa caixa se o cliente perdeu a senha; uma nova senha provisória é gerada e mostrada na hora.</>,
          <>O telefone cadastrado vira um link direto de WhatsApp na listagem.</>,
          <><strong>Excluir cliente</strong> exige confirmar a sua própria senha de administrador antes de apagar. Se o cliente tiver contratos com PDF anexado, o painel avisa e mostra links pra baixar antes de confirmar a exclusão — os dados vinculados (contratos, projetos) são apagados junto.</>,
        ]}
      />
      <TipBox>
        O e-mail cadastrado aqui é o login do cliente na área dele — o portal do cliente é assunto de outro
        tutorial, fora deste painel de gestor.
      </TipBox>
      <WarningBox>Excluir um cliente é uma ação permanente e irreversível — apaga também os contratos e projetos ligados a ele.</WarningBox>
      <ClientesMockup />
    </div>
  ),
};
