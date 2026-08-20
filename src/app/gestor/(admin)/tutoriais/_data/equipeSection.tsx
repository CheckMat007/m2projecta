// src/app/gestor/(admin)/tutoriais/_data/equipeSection.tsx
import { UserCog, Eye, Shield } from 'lucide-react';
import { MockupFrame, MockCard, MockButton, MockBadge } from '../_components/mockups/MockupFrame';
import { SectionIntro, FeatureList, PermissionNote, WarningBox, TipBox } from '../_components/TutorialUI';
import type { TutorialSection } from './types';

function EquipeMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor/equipe" activeMenuIndex={8}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Equipe</h1>
        <MockButton>Adicionar Usuário</MockButton>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { name: 'Matheus Ferro', role: 'violet', roleLabel: 'Master', status: 'Acesso Administrativo Completo' },
          { name: 'Ana Silva', role: 'muted', roleLabel: 'Editor', status: '3 permissões atribuídas' },
        ].map((u, i) => (
          <MockCard key={i} className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-muted/60" />
                <span className="text-[11px] font-semibold">{u.name}</span>
              </div>
              <MockBadge tone={u.role as 'violet' | 'muted'}>{u.roleLabel}</MockBadge>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground mb-2"><Shield size={9} />{u.status}</div>
            <div className="flex items-center justify-between bg-muted/40 rounded px-1.5 py-1">
              <span className="flex items-center gap-1 text-[9px]"><Eye size={9} />Visível</span>
              <div className="h-3 w-6 rounded-full bg-m2-green/60" />
            </div>
          </MockCard>
        ))}
      </div>
    </MockupFrame>
  );
}

export const equipeSection: TutorialSection = {
  id: 'equipe',
  label: 'Equipe',
  icon: UserCog,
  permission: 'manage_team',
  content: (
    <div>
      <SectionIntro>Gerenciamento dos usuários que têm acesso ao painel do gestor (Master e Editores) — não confundir com o cadastro de Clientes.</SectionIntro>
      <PermissionNote permission="manage_team" />
      <FeatureList
        items={[
          <><strong>Adicionar Usuário</strong> — Nome, E-mail, Senha Provisória, e a <strong>Função no Sistema</strong> (Editor ou Master).</>,
          <>A lista de <strong>Permissões Específicas</strong> é uma lista de caixas de seleção, uma por permissão existente (Gerenciar Site, Clientes, Projetos, Portfólio, Contratos, Equipe, Blog, Enviar/Gerenciar Notificações) — marque as que esse usuário deve ter.</>,
          <>Só um usuário <strong>Master</strong> pode criar outro Master, promover alguém a Master, editar os dados de um Master, ou excluir um Master — um Editor com a permissão de Equipe consegue gerenciar outros Editores, mas o campo de função fica travado.</>,
          <>Interruptor <strong>“Visível”</strong> em cada card — controla se aquele membro da equipe aparece na página pública “Sobre Nós” do site.</>,
          <>Excluir um usuário é imediato (com confirmação) e corta o acesso dele ao painel na hora. Não é possível excluir a própria conta, nem excluir o último Master restante.</>,
        ]}
      />
      <WarningBox>
        Clientes não são criados aqui — mesmo que exista um papel “Cliente” no sistema, esta tela só lista e
        cria contas de gestor (Master/Editor). Acesso de cliente é feito na tela de Clientes.
      </WarningBox>
      <TipBox>A força da senha (maiúscula, minúscula, número, símbolo, 8+ caracteres) é validada em tempo real enquanto você digita.</TipBox>
      <EquipeMockup />
    </div>
  ),
};
