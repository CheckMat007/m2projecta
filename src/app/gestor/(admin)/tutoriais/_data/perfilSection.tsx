// src/app/gestor/(admin)/tutoriais/_data/perfilSection.tsx
import { UserCircle, ShieldAlert } from 'lucide-react';
import { MockupFrame, MockCard, MockButton } from '../_components/mockups/MockupFrame';
import { SectionIntro, FeatureList, PermissionNote, TipBox } from '../_components/TutorialUI';
import type { TutorialSection } from './types';

function PerfilMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor/perfil" activeMenuIndex={-1}>
      <h1 className="text-lg font-bold mb-4">Meu Perfil</h1>
      <div className="grid grid-cols-3 gap-3">
        <MockCard className="col-span-2 p-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-full bg-muted/60" />
            <div className="space-y-1.5 flex-1">
              <div className="h-2 bg-muted/50 rounded w-1/2" />
              <div className="h-2 bg-muted/40 rounded w-1/3" />
            </div>
          </div>
          <div className="space-y-1.5">
            {[80, 60].map((w, i) => <div key={i} className="h-6 bg-muted/40 rounded" style={{ width: `${w}%` }} />)}
          </div>
          <div className="flex justify-end mt-2"><MockButton>Salvar Alterações</MockButton></div>
        </MockCard>
        <MockCard className="p-3 border-red-500/20">
          <div className="flex items-center gap-1.5 mb-2 text-red-500"><ShieldAlert size={12} /><span className="text-[11px] font-semibold">Segurança</span></div>
          <div className="space-y-1.5">
            {[1, 2, 3].map((i) => <div key={i} className="h-5 bg-muted/40 rounded" />)}
          </div>
          <div className="mt-2"><MockButton variant="destructive">Atualizar Senha</MockButton></div>
        </MockCard>
      </div>
    </MockupFrame>
  );
}

export const perfilSection: TutorialSection = {
  id: 'perfil',
  label: 'Meu Perfil',
  icon: UserCircle,
  content: (
    <div>
      <SectionIntro>
        Não fica no menu lateral — acessa clicando no seu próprio avatar no topo/rodapé da barra lateral. É onde
        cada gestor cuida da própria conta.
      </SectionIntro>
      <PermissionNote />
      <FeatureList
        items={[
          <><strong>Dados Pessoais</strong> — foto (clique pra trocar), Nome, Telefone/WhatsApp. O e-mail não pode ser alterado por aqui — é preciso falar com o suporte.</>,
          <><strong>Perfil Profissional</strong> — Cargo/Função e uma frase/bio curta, mais o interruptor <strong>“Exibir no Site”</strong>, que controla se você aparece na página pública “Sobre Nós”.</>,
          <><strong>Segurança</strong> — troca de senha, exigindo a senha atual, com checklist de força da nova senha em tempo real.</>,
        ]}
      />
      <TipBox>
        O interruptor “Exibir no Site” só tem efeito de verdade se for salvo por um usuário Master — um
        Editor pode mexer no interruptor, mas a mudança não é salva se ele mesmo tentar.
      </TipBox>
      <PerfilMockup />
    </div>
  ),
};
