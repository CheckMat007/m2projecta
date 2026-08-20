// src/app/gestor/(admin)/tutoriais/_data/blogSections.tsx
import { BookText, FolderOpen, Hash, Bold, Italic, LinkIcon, ImageIcon, List } from 'lucide-react';
import { MockupFrame, MockCard, MockBadge, MockButton } from '../_components/mockups/MockupFrame';
import { SectionIntro, FeatureList, PermissionNote, TipBox, SubHeading } from '../_components/TutorialUI';
import type { TutorialSection } from './types';

function PostListMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor/blog" activeMenuIndex={2}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold">Blog</h1>
        <div className="flex gap-2">
          <MockButton variant="outline">Categorias</MockButton>
          <MockButton variant="outline">Tags</MockButton>
          <MockButton>Criar Post</MockButton>
        </div>
      </div>
      <MockCard className="overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 px-3 py-2 text-[10px] font-semibold text-muted-foreground border-b border-border bg-muted/40">
          <span>Postagem</span><span>Status</span><span>Autor</span><span>Data</span><span>Ações</span>
        </div>
        {[
          { title: 'Nova Regra da ANAC para pilotos', status: 'green', statusLabel: 'Publicado', author: 'Matheus' },
          { title: 'Como escolher o melhor ângulo aéreo', status: 'muted', statusLabel: 'Rascunho', author: 'Ana' },
        ].map((p, i) => (
          <div key={i} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 px-3 py-2.5 text-[11px] items-center border-b border-border last:border-0">
            <span className="font-medium truncate">{p.title}</span>
            <MockBadge tone={p.status as 'green' | 'muted'}>{p.statusLabel}</MockBadge>
            <span className="text-muted-foreground">{p.author}</span>
            <span className="text-muted-foreground">12 ago</span>
            <span className="text-muted-foreground">✏️ 🗑️</span>
          </div>
        ))}
      </MockCard>
    </MockupFrame>
  );
}

function PostFormMockup() {
  return (
    <MockupFrame url="m2projecta.com.br/gestor/blog/novo" activeMenuIndex={2}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <MockCard className="p-3">
            <div className="h-6 bg-muted/60 rounded mb-3 w-2/3" />
            <div className="flex gap-1.5 mb-2 pb-2 border-b border-border">
              {[Bold, Italic, LinkIcon, ImageIcon, List].map((Icon, i) => (
                <div key={i} className="h-6 w-6 rounded bg-muted/60 flex items-center justify-center">
                  <Icon size={11} className="text-muted-foreground" />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {[100, 90, 75, 95].map((w, i) => (
                <div key={i} className="h-2 bg-muted/50 rounded" style={{ width: `${w}%` }} />
              ))}
            </div>
          </MockCard>
          <MockCard className="p-3">
            <span className="text-[11px] font-semibold">SEO</span>
            <div className="mt-2 space-y-1.5">
              <div className="h-2 bg-blue-500/30 rounded w-3/4" />
              <div className="h-2 bg-green-600/30 rounded w-1/2" />
              <div className="h-2 bg-muted/40 rounded w-full" />
            </div>
          </MockCard>
        </div>
        <div className="space-y-3">
          <MockCard className="p-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold">Destaque</span>
            <div className="h-4 w-8 rounded-full bg-m2-green/60" />
          </MockCard>
          <MockCard className="p-3 h-20 border-dashed flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground">Imagem de Destaque</span>
          </MockCard>
          <MockCard className="p-3">
            <span className="text-[11px] font-semibold">Categorias</span>
            <div className="flex gap-1 mt-2 flex-wrap">
              <MockBadge tone="muted">Drones ×</MockBadge>
              <MockBadge tone="muted">Notícias ×</MockBadge>
            </div>
          </MockCard>
        </div>
      </div>
    </MockupFrame>
  );
}

const postsSection: TutorialSection = {
  id: 'blog-posts',
  label: 'Posts',
  icon: BookText,
  permission: 'manage_blog',
  content: (
    <div>
      <SectionIntro>
        Lista e editor de artigos do blog público. Nenhuma busca, filtro ou paginação — todos os posts
        aparecem de uma vez, do mais novo para o mais antigo.
      </SectionIntro>
      <PermissionNote permission="manage_blog" />
      <FeatureList
        items={[
          <>Cada linha mostra status (Publicado/Rascunho), autor, categorias e data; os botões de editar e excluir ficam à direita.</>,
          <><strong>Criar Post</strong> — abre o editor completo (mesmo formulário usado para editar).</>,
          <><strong>Categorias</strong> e <strong>Tags</strong> — atalhos para as telas de gerenciamento dessas duas taxonomias.</>,
        ]}
      />
      <PostListMockup />

      <SubHeading>O editor de post</SubHeading>
      <FeatureList
        items={[
          <><strong>Título Principal</strong> — obrigatório.</>,
          <><strong>Editor de texto rico</strong> (negrito, itálico, sublinhado, tachado, marcador de texto, alinhamento, listas, citação, links, superscrito/subscrito) com um botão próprio para <strong>inserir imagem no meio do texto</strong> — ao inserir, pede Texto Alternativo e Fonte/Créditos da imagem.</>,
          <><strong>SEO</strong> — Título SEO e Meta Descrição, com uma prévia ao vivo de como o post aparece no Google.</>,
          <><strong>“Post em Destaque”</strong> — interruptor que fixa o post no topo do blog.</>,
          <><strong>Imagem de Destaque</strong> — capa do post (clique para enviar), mais campo de Texto Alternativo e Fonte da Imagem.</>,
          <><strong>Categorias</strong> — escolhidas de uma lista (não dá pra criar categoria nova aqui, só na tela de Categorias).</>,
          <><strong>Tags</strong> — mesma lógica, mas aqui dá pra criar uma tag nova direto na hora, digitando o nome.</>,
          <><strong>Salvar Rascunho</strong> vs <strong>Publicar</strong> — dois botões separados; o post entra como rascunho ou já fica público dependendo de qual você clica.</>,
        ]}
      />
      <TipBox>
        Link/slug do post, tempo de leitura e data de publicação são calculados automaticamente — não têm
        campo pra editar manualmente.
      </TipBox>
      <PostFormMockup />
    </div>
  ),
};

const categoriasSection: TutorialSection = {
  id: 'blog-categorias',
  label: 'Categorias',
  icon: FolderOpen,
  permission: 'manage_blog',
  content: (
    <div>
      <SectionIntro>Lista simples de categorias do blog, usada para agrupar posts por assunto.</SectionIntro>
      <PermissionNote permission="manage_blog" />
      <FeatureList
        items={[
          <><strong>Nova Categoria</strong> — pede só o nome; o endereço amigável (slug) é gerado sozinho.</>,
          <>Editar (lápis) e excluir (lixeira, com confirmação) em cada linha.</>,
          <>Excluir uma categoria <strong>não apaga</strong> os posts vinculados a ela — eles só perdem essa classificação.</>,
        ]}
      />
    </div>
  ),
};

const tagsSection: TutorialSection = {
  id: 'blog-tags',
  label: 'Tags',
  icon: Hash,
  permission: 'manage_blog',
  content: (
    <div>
      <SectionIntro>Igual à tela de Categorias, mas para tags (palavras-chave) usadas na busca e filtragem do blog.</SectionIntro>
      <PermissionNote permission="manage_blog" />
      <FeatureList
        items={[
          <><strong>Nova Tag</strong> — nome + slug automático.</>,
          <>Editar e excluir por linha, mesma lógica de Categorias.</>,
          <>Excluir uma tag não apaga os posts — só remove a referência.</>,
        ]}
      />
    </div>
  ),
};

export const blogSections: TutorialSection[] = [postsSection, categoriasSection, tagsSection];
