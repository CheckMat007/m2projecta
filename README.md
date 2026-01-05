# 🚁 M2 Projecta

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Prisma](https://img.shields.io/badge/Prisma-ORM-green)

Sistema de **Gestão de Serviços de Imagens Aéreas** e **CRM** — combina uma vitrine pública otimizada para aquisição de clientes com um painel administrativo para gestão de projetos, contratos e entregáveis.

**Sumário**

- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Instalação e Execução](#instalação-e-execução)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Segurança e Performance](#segurança-e-performance)
- [Contribuição e Autor](#contribuição-e-autor)

---

## Funcionalidades

### Área Pública (Vitrine)
- Landing page otimizada para conversão.
- Páginas dinâmicas de serviços via `src/app/servicos/[slug]`.
- Portfólio interativo com filtros e detalhes técnicos.
- SEO técnico: `sitemap.xml` dinâmico, `robots.txt`, metadados e OpenGraph.
- Blog integrado para publicações.

### Painel Gestor (Admin)
- Dashboard com métricas e visão geral.
- CRUD completo de clientes (PJ/PF) e geração de credenciais.
- Gestão de contratos e projetos com uploads (PDF).
- Timeline de projetos com updates em tempo real.
- CMS para serviços e itens do portfólio.

### Área do Cliente
- Portal seguro com login.
- Acompanhamento do projeto (timeline, status em tempo real).
- Entregáveis disponíveis para download seguro.
- Notificações sobre atualizações.

---

## Stack Tecnológica

- Framework: Next.js 14 (App Router & Server Actions)
- Linguagem: TypeScript
- CSS: Tailwind CSS
- Componentes: shadcn/ui + Radix UI
- Ícones: Lucide React
- Banco de Dados: PostgreSQL
- ORM: Prisma
- Autenticação: NextAuth.js
- Validação: Zod
- Uploads: Vercel Blob (ou API de Blob Storage)

---

## Instalação e Execução

1. Clone o repositório:

```bash
git clone https://github.com/CheckMat007/m2projecta.git
cd m2projecta
```

2. Instale dependências:

```bash
npm install
```

3. Gere o cliente Prisma e aplique migrations (desenvolvimento):

```bash
npx prisma generate
npx prisma migrate dev
```

4. Execute em modo desenvolvimento:

```bash
npm run dev
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz com as variáveis mínimas abaixo (exemplo):

```env
DATABASE_URL="postgresql://user:password@host:port/db"
NEXTAUTH_SECRET="sua-chave-secreta"
NEXTAUTH_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN="seu-token-de-blob"
```

Consulte `prisma/schema.prisma` para detalhes sobre o banco de dados.

---

## Estrutura do Projeto (resumo)

- `src/app/(main)`: rotas públicas (layout, home, serviços).
- `src/app/gestor`: painel administrativo protegido por middleware.
- `src/app/cliente`: área do cliente protegida.
- `src/components/ui`: componentes reutilizáveis.
- `prisma/schema.prisma`: modelagem do banco.

---

## Segurança e Performance

- Middleware: controle de acesso por papéis (admin vs cliente).
- Server Actions: lógica sensível executada no servidor.
- ReCAPTCHA: proteção contra bots nos formulários.
- Imagens: uso do componente `Image` do Next.js para otimização automática.

---

## Contribuição e Autor

Desenvolvido por Gustavo Levenhagen.

