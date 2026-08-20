// src/app/gestor/(admin)/tutoriais/_data/notificacoesSection.tsx
import { Bell, Send, Trash2 } from 'lucide-react';
import { MockupFrame, MockCard, MockButton } from '../_components/mockups/MockupFrame';
import { SectionIntro, FeatureList, PermissionNote, WarningBox } from '../_components/TutorialUI';
import type { TutorialSection } from './types';

function NotificationsMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor/notifications" activeMenuIndex={1}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Notificações</h1>
        <MockButton><Send size={11} /> Nova Mensagem</MockButton>
      </div>
      <MockCard className="overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-2 text-[10px] font-semibold text-muted-foreground border-b border-border bg-muted/40">
          <span>Título</span><span>Enviado por</span><span>Data</span><span>Ações</span>
        </div>
        {[
          { title: 'Manutenção do sistema', by: 'Master', tag: 'Todos', date: '19 ago, 14:20' },
          { title: 'Novo processo de aprovação', by: 'Ana Silva', tag: 'Direto', date: '18 ago, 09:05' },
        ].map((n, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 px-3 py-2.5 text-[11px] items-center border-b border-border last:border-0">
            <span className="font-medium truncate">{n.title}</span>
            <span className="text-muted-foreground">{n.by}</span>
            <span className="text-muted-foreground">{n.date}</span>
            <Trash2 size={12} className="text-muted-foreground" />
          </div>
        ))}
      </MockCard>
    </MockupFrame>
  );
}

export const notificacoesSection: TutorialSection = {
  id: 'notificacoes',
  label: 'Notificações',
  icon: Bell,
  permission: 'manage_notifications',
  content: (
    <div>
      <SectionIntro>
        Ferramenta de comunicação interna: envie avisos para toda a equipe ou para pessoas específicas, e
        consulte o histórico do que já foi enviado.
      </SectionIntro>
      <PermissionNote permission="manage_notifications" />
      <WarningBox>
        Enviar uma notificação exige a permissão <code>send_notifications</code>, mas essa permissão sozinha
        não é suficiente — sem <code>manage_notifications</code> a página nem aparece no menu. Na prática, dê as
        duas permissões juntas para quem precisa enviar avisos.
      </WarningBox>
      <FeatureList
        items={[
          <><strong>Nova Mensagem</strong> — abre um formulário com Título e Mensagem (obrigatórios).</>,
          <><strong>“Enviar para todos”</strong> — interruptor ligado por padrão (envia pra toda a equipe); ao desligar, aparece uma lista com checkbox de cada usuário pra escolher destinatários específicos.</>,
          <><strong>Histórico</strong> — lista/tabela com todas as notificações enviadas: título, quem enviou, data, e (só para usuários Master) para quem foi enviada.</>,
          <>Clicar em uma notificação da lista abre o conteúdo completo dela.</>,
          <><strong>Excluir</strong> (ícone de lixeira) — remove a notificação para todos os destinatários, com confirmação. Editores só podem excluir notificações que eles mesmos enviaram; Master pode excluir qualquer uma.</>,
        ]}
      />
      <NotificationsMockup />
    </div>
  ),
};
