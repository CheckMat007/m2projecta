// src/app/gestor/(admin)/tutoriais/_data/siteSections.tsx
import { Home, BookOpen, Briefcase, Paintbrush, Youtube, HelpCircle } from 'lucide-react';
import { MockupFrame, MockCard, MockButton } from '../_components/mockups/MockupFrame';
import { SectionIntro, FeatureList, PermissionNote, WarningBox, TipBox } from '../_components/TutorialUI';
import type { TutorialSection } from './types';

function InicioMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor/site/inicio" activeMenuIndex={3}>
      <h1 className="text-lg font-bold mb-4">Página Inicial</h1>
      <div className="space-y-3">
        <MockCard className="p-3">
          <div className="flex items-center gap-2 mb-2"><Youtube size={14} className="text-red-500" /><span className="text-[11px] font-semibold">Seção Hero</span></div>
          <div className="h-7 bg-muted/50 rounded" />
        </MockCard>
        <MockCard className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2"><HelpCircle size={14} /><span className="text-[11px] font-semibold">Perguntas Frequentes</span></div>
            <MockButton>Nova Pergunta</MockButton>
          </div>
          {['Como funciona o orçamento?', 'Vocês atendem fora do Vale do Paraíba?'].map((q, i) => (
            <div key={i} className="text-[10px] py-1.5 border-t border-border text-muted-foreground">{q}</div>
          ))}
        </MockCard>
      </div>
    </MockupFrame>
  );
}

const inicioSection: TutorialSection = {
  id: 'site-inicio',
  label: 'Início',
  icon: Home,
  permission: 'manage_site',
  content: (
    <div>
      <SectionIntro>Conteúdo dinâmico da página inicial pública: o vídeo de destaque e o FAQ.</SectionIntro>
      <PermissionNote permission="manage_site" />
      <FeatureList
        items={[
          <><strong>Seção Hero</strong> — um campo só: o link do vídeo do YouTube (normal ou Shorts) que toca no topo da home. A orientação vertical/horizontal é detectada sozinha pelo link.</>,
          <><strong>Perguntas Frequentes</strong> — lista em formato “sanfona” (clique pra expandir a resposta). Criar, editar e excluir pergunta+resposta pelo botão “Nova Pergunta” e pelos ícones de cada item.</>,
        ]}
      />
      <WarningBox>
        A tela também tem uma seção de <strong>Depoimentos</strong> por trás dos panos (o banco de dados já
        suporta), mas hoje não existe nenhum controle na interface para cadastrá-los — não é possível gerenciar
        depoimentos pelo painel ainda.
      </WarningBox>
      <InicioMockup />
    </div>
  ),
};

const sobreSection: TutorialSection = {
  id: 'site-sobre',
  label: 'Sobre Nós',
  icon: BookOpen,
  permission: 'manage_site',
  content: (
    <div>
      <SectionIntro>Controla o bloco “Nossa História” exibido na página “Sobre Nós” do site público — um bloco único, não uma lista.</SectionIntro>
      <PermissionNote permission="manage_site" />
      <FeatureList
        items={[
          <><strong>Título da Seção</strong> e <strong>Conteúdo Principal</strong> — texto simples (sem formatação rica, é uma caixa de texto comum).</>,
          <><strong>Imagem de Destaque</strong> — arraste e solte ou clique para enviar (JPG, PNG ou WEBP).</>,
        ]}
      />
      <TipBox>Não existe um “adicionar nova seção” aqui — é sempre o mesmo bloco único sendo editado.</TipBox>
    </div>
  ),
};

function ServicosMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor/site/servicos" activeMenuIndex={3}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Serviços</h1>
        <MockButton>Novo Serviço</MockButton>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {['Vídeo Institucional', 'Inspeção de Obra', 'Imagens 360°'].map((name, i) => (
          <MockCard key={i} className="overflow-hidden">
            <div className="h-14 bg-muted/50" />
            <div className="p-2">
              <span className="text-[10px] font-semibold block truncate">{name}</span>
              <div className="mt-2 h-5 rounded border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-[9px] text-muted-foreground">Editar</div>
            </div>
          </MockCard>
        ))}
      </div>
    </MockupFrame>
  );
}

const servicosSection: TutorialSection = {
  id: 'site-servicos',
  label: 'Serviços',
  icon: Briefcase,
  permission: 'manage_site',
  content: (
    <div>
      <SectionIntro>Catálogo de serviços exibido no menu principal e na página de Serviços do site — os mesmos serviços aparecem como opção ao criar Projetos e Portfólio.</SectionIntro>
      <PermissionNote permission="manage_site" />
      <FeatureList
        items={[
          <>Lista em cards, cada um com imagem de capa, ícone e descrição curta.</>,
          <><strong>Nome do Serviço</strong>, <strong>Descrição Curta</strong> (aparece nos cards) e <strong>Descrição Longa</strong> (aparece na página interna do serviço).</>,
          <><strong>Ícone</strong> — não é uma grade visual pra escolher; você digita o nome do ícone (biblioteca Lucide) e vê uma prévia ao lado, com link direto pra a página de ícones caso precise pesquisar um nome.</>,
          <><strong>Vídeo do YouTube</strong> — opcional.</>,
          <><strong>Imagem de Destaque</strong> — obrigatória ao criar.</>,
          <>Excluir um serviço avisa que isso pode afetar itens do portfólio vinculados a ele.</>,
        ]}
      />
      <ServicosMockup />
    </div>
  ),
};

const aparenciaSection: TutorialSection = {
  id: 'site-aparencia',
  label: 'Aparência',
  icon: Paintbrush,
  permission: 'manage_site',
  content: (
    <div>
      <SectionIntro>Apesar do nome sugerir mais, hoje esta tela controla só uma coisa.</SectionIntro>
      <PermissionNote permission="manage_site" />
      <FeatureList
        items={[
          <><strong>Imagem de fundo (Hero)</strong> da página “Sobre Nós” — um único banner, formato bem largo (recomendado 1920×1080px).</>,
        ]}
      />
      <WarningBox>
        Não há controle de cores, temas ou heróis de outras páginas por aqui ainda — só essa imagem de fundo
        específica da página Sobre.
      </WarningBox>
    </div>
  ),
};

export const siteSections: TutorialSection[] = [inicioSection, sobreSection, servicosSection, aparenciaSection];
