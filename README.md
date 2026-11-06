# M2 Projecta

Sistema de gestão de serviços de imagens aéreas e CRM da M2 Projecta. O projeto reúne uma vitrine pública para apresentação de serviços, um painel interno para gestão comercial e operacional e um portal para acompanhamento de projetos pelos clientes.

## Visão geral

A M2 Projecta atua com imagens aéreas, vídeos, mapeamento e produção audiovisual com drones em Taubaté, no Vale do Paraíba e região. O site público apresenta a empresa, serviços, portfólio e conteúdo editorial, enquanto as áreas autenticadas organizam clientes, contratos, projetos, entregáveis e notificações.

## Funcionalidades

### Site público

- Página inicial com apresentação da empresa e chamadas para orçamento.
- Catálogo de serviços com páginas detalhadas gerenciadas pelo CMS.
- Portfólio de projetos publicados, com galerias, vídeos e visualizações 3D quando disponíveis.
- Blog com posts, categorias, tags, busca, comentários e votação.
- Páginas institucionais, contato, termos e política de privacidade.
- SEO técnico com metadados, Open Graph, dados estruturados, sitemap e robots.
- Formulários protegidos por reCAPTCHA e upload de arquivos via Vercel Blob.

### Painel do gestor

- Dashboard administrativo com permissões por usuário.
- Cadastro e gestão de clientes, usuários e credenciais.
- Gestão de contratos, projetos, status, atualizações e entregáveis.
- CMS para serviços, portfólio, blog e conteúdo institucional.
- Gestão de depoimentos, perguntas frequentes, configurações do site e notificações.
- Upload de imagens e documentos pelo endpoint compartilhado `/api/upload`.

### Portal do cliente

- Login seguro separado da área administrativa.
- Acompanhamento do status e da linha do tempo do projeto.
- Consulta e download de entregáveis disponibilizados.
- Visualização de contratos e notificações.
- Fluxo de primeiro acesso para alteração obrigatória de senha.

## Arquitetura

O projeto usa Next.js 14 com App Router e três zonas de navegação:

- `src/app/(main)`: páginas públicas, sem autenticação.
- `src/app/gestor`: painel interno, protegido por sessão e permissões.
- `src/app/cliente`: portal do cliente, protegido por sessão e pelo papel `CLIENT`.

O middleware centraliza o bloqueio de rotas, redirecionamentos por papel e fluxo de primeiro acesso. As mutações administrativas usam Server Actions, validação com Zod, Prisma e revalidação das páginas afetadas.

## Stack

- Next.js 15, React 18 e TypeScript.
- Tailwind CSS, shadcn/ui, Radix UI e Lucide React.
- Prisma ORM com PostgreSQL (Supabase).
- NextAuth.js com autenticação por credenciais e sessões JWT.
- Zod para validação de dados.
- Vercel Blob para armazenamento de imagens e documentos.
- Swiper, Framer Motion e Three.js para experiências visuais.

## Requisitos

- Node.js compatível com Next.js 15.
- npm.
- PostgreSQL acessível para desenvolvimento.
- Credenciais dos serviços externos usados pelo ambiente.

## Instalação e execução

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/CheckMat007/m2projecta.git
cd m2projecta
npm install
```

Configure as variáveis de ambiente, gere o cliente Prisma e execute o servidor:

```bash
npx prisma generate
npm run dev
```

O site ficará disponível em `http://localhost:3000`.

Para criar e aplicar migrations em desenvolvimento:

```bash
npx prisma migrate dev
```

Quando o banco não estiver acessível, uma migration pode ser criada manualmente em `prisma/migrations/` e aplicada posteriormente com:

```bash
npx prisma migrate deploy
```

## Variáveis de ambiente

Crie um arquivo `.env` local. Nunca versione valores reais, tokens ou segredos.

```env
DATABASE_URL="postgresql://usuario:senha@host:porta/banco"
NEXTAUTH_SECRET="segredo-da-sessao"
NEXTAUTH_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN="token-do-vercel-blob"
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="chave-publica-recaptcha"
RECAPTCHA_SECRET_KEY="chave-secreta-recaptcha"
CRON_SECRET="segredo-do-cron"
GOOGLE_MAPS_API_KEY="chave-da-api-do-google"
GOOGLE_PLACE_ID="id-do-local-no-google"
```

`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` é usada nos formulários públicos e de login. A verificação server-side usa `RECAPTCHA_SECRET_KEY`. O endpoint de avaliações agendadas exige `CRON_SECRET` e as variáveis do Google Maps.

## Comandos

```bash
npm run dev              # Servidor de desenvolvimento
npm run build            # Gera o Prisma Client e cria o build de produção
npm run start            # Inicia o build de produção
npm run lint             # Executa o ESLint/Next.js
npx tsc --noEmit         # Verifica os tipos sem emitir arquivos
npx prisma generate      # Regenera o Prisma Client
npx prisma studio        # Abre o navegador do banco
```

O projeto não possui uma suíte de testes automatizados configurada. O lint e o TypeScript são as verificações principais antes de publicar alterações.

## Estrutura relevante

```text
src/
  app/
    (main)/              # Site público
    gestor/              # Painel administrativo
    cliente/             # Portal do cliente
    api/                 # Uploads, cron e endpoints públicos
  components/            # Componentes compartilhados e UI
  lib/                   # Prisma, autenticação, SEO e utilitários
prisma/
  schema.prisma          # Modelo de dados
  migrations/            # Histórico de migrations
  seed.ts                # Permissões iniciais
public/
  llms.txt               # Contexto oficial para sistemas de IA
```

## Segurança e operação

- Não exponha arquivos `.env`, credenciais de usuários ou tokens de serviços.
- O acesso é controlado por middleware, sessão JWT, papéis e permissões.
- Operações de escrita devem permanecer no servidor e validar entradas com Zod.
- Uploads passam pelo endpoint único de armazenamento e devem respeitar os limites do ambiente.
- A execução de voos e captações depende das condições de segurança e autorizações aplicáveis ao local.

## Licença

Este software é proprietário. Consulte o arquivo [LICENSE](./LICENSE) para as condições de uso, cópia, modificação e distribuição.

## Contato

- Site: [m2projecta.com.br](https://www.m2projecta.com.br/)
- E-mail: [contato@m2projecta.com.br](mailto:contato@m2projecta.com.br)
- WhatsApp: [+55 12 99131-6774](https://wa.me/5512991316774)

Desenvolvido por Gustavo Levenhagen para a M2 Projecta.
