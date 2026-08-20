// src/app/gestor/(admin)/tutoriais/_data/portfolioSection.tsx
import { LayoutTemplate, Star, ImageIcon } from 'lucide-react';
import { MockupFrame, MockCard, MockButton, MockBadge } from '../_components/mockups/MockupFrame';
import { SectionIntro, FeatureList, PermissionNote, TipBox } from '../_components/TutorialUI';
import type { TutorialSection } from './types';

function PortfolioMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor/portfolio" activeMenuIndex={7}>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-bold">Portfólio</h1>
        <MockButton>Adicionar Item</MockButton>
      </div>
      <div className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded px-2 py-1 mb-3">
        Você tem 6 de 10 projetos destacados na Home.
      </div>
      <div className="grid grid-cols-3 gap-3">
        {['Arraia do GAMT', 'Litoral e Turismo', 'Empreendimento X'].map((name, i) => (
          <MockCard key={i} className="overflow-hidden">
            <div className="h-14 bg-muted/50 flex items-center justify-center relative">
              <ImageIcon size={16} className="text-muted-foreground/40" />
              <div className="absolute top-1 right-1"><MockBadge tone="green">Publicado</MockBadge></div>
            </div>
            <div className="p-2">
              <span className="text-[10px] font-semibold block truncate mb-1">{name}</span>
              <div className="flex items-center justify-between bg-muted/40 rounded px-1.5 py-1">
                <span className="flex items-center gap-1 text-[9px]"><Star size={9} className="text-amber-400" />Destaque</span>
                <div className="h-3 w-6 rounded-full bg-m2-green/60" />
              </div>
            </div>
          </MockCard>
        ))}
      </div>
    </MockupFrame>
  );
}

export const portfolioSection: TutorialSection = {
  id: 'portfolio',
  label: 'Portfólio',
  icon: LayoutTemplate,
  permission: 'manage_portfolio',
  content: (
    <div>
      <SectionIntro>Vitrine de projetos exibida na página de Portfólio do site público.</SectionIntro>
      <PermissionNote permission="manage_portfolio" />
      <FeatureList
        items={[
          <>Cada card mostra a capa, status (Publicado/Rascunho), categoria (Serviço vinculado) e um interruptor de <strong>Destaque na Home</strong> direto no card — sem precisar abrir o item.</>,
          <>Limite de <strong>10 itens em destaque</strong> ao mesmo tempo na home; um aviso no topo mostra quantos já estão em uso.</>,
          <><strong>Adicionar Item</strong> — Título, Serviço vinculado, Descrição curta e longa, Imagem de capa, Galeria de imagens adicionais, Vídeo do YouTube (opcional), Status (Publicado/Rascunho), campos de SEO (título e descrição), e o interruptor de Destaque.</>,
          <>Editar (lápis) reabre o mesmo formulário; excluir (lixeira) some com o item.</>,
        ]}
      />
      <TipBox>
        O endereço amigável (slug) da página pública de cada item é gerado automaticamente a partir do
        título — inclusive links antigos continuam funcionando e redirecionam sozinhos para o novo endereço.
      </TipBox>
      <PortfolioMockup />
    </div>
  ),
};
