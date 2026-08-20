# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

M2 Projecta — a Next.js 14 (App Router) system combining a public marketing site for an aerial imagery/drone services business with an admin panel (CRM-lite: clients, contracts, projects, portfolio/blog CMS) and a client portal for tracking project delivery. Content is in Brazilian Portuguese throughout (UI copy, form labels, Zod error messages, code comments) — keep new user-facing strings consistent with that.

## Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build             # prisma generate && next build
npm run lint               # next lint (eslint-config-next)
npx tsc --noEmit           # Type-check without emitting (no test runner in this repo — this + lint is the correctness check)

npx prisma generate         # Regenerate Prisma Client after any schema.prisma change
npx prisma migrate dev      # Create + apply a migration in dev (needs a reachable DB)
npx prisma migrate deploy   # Apply pending migrations without prompting (used when migrate dev can't reach the DB directly)
npx prisma studio           # Browse the database
```

There is no test suite (no jest/vitest config, no `*.test.*` files) — `tsc --noEmit` and `next lint` are the available correctness gates before considering a change done.

### Windows dev-loop gotcha

`npx prisma generate` fails with `EPERM ... query_engine-windows.dll.node` if a `next dev` process is currently running, because it holds a lock on the engine binary. Stop the dev server first, run `prisma generate`, then restart `npm run dev`.

### Database connectivity

`DATABASE_URL` points at a remote Supabase Postgres instance. Connections can fail intermittently (`P1001 Can't reach database server`) — this is transient (Supabase cold start / pooler hiccup), not a code issue; retry the command before assuming something is broken.

### Writing a migration when the DB isn't reachable

If `prisma migrate dev` can't reach the database, hand-write the migration SQL under `prisma/migrations/<UTC timestamp>_<description>/migration.sql` (get the timestamp with `date -u +%Y%m%d%H%M%S`) and run `prisma generate` (which only needs the schema file, not a live DB) so the client types are available immediately. Apply it for real with `prisma migrate deploy` once the DB is reachable. If a column already exists in the DB but isn't recorded in migration history (e.g. it was pushed out-of-band), use `prisma migrate resolve --applied <migration_name>` instead of re-running the SQL.

### One-off data scripts

Root-level scripts like `fix-slugs.ts` and `prisma/seed.ts` are ad-hoc Prisma scripts run with `tsx` (e.g. `npx tsx fix-slugs.ts`). `prisma/seed.ts` seeds the `Permission` rows used by the admin sidebar.

## Architecture

### Three-zone routing, enforced by one middleware

`src/middleware.ts` is the single access-control point (matcher: `/gestor/:path*`, `/cliente/:path*`). It reads the NextAuth JWT and:
- Redirects unauthenticated users to `/gestor/login` or `/cliente/login`.
- Cross-blocks roles: a `CLIENT` role hitting `/gestor/*` is bounced to `/cliente`, and any non-`CLIENT` role hitting `/cliente/*` is bounced to `/gestor`.
- Forces a `mustChangePassword` user to `/gestor/primeiro-acesso` or `/cliente/primeiro-acesso` (first-access password change flow) before letting them anywhere else.

The three route groups under `src/app`:
- `(main)` — public marketing site (home, `servicos/[slug]`, `portfolio/[id]`, `blog`, etc.). No auth.
- `gestor/(admin)` — admin panel, gated by the middleware above **and** by a second, finer-grained permission check inside `gestor/(admin)/layout.tsx` (see below).
- `cliente/(painel)` — client portal, gated the same way, role must be `CLIENT`.

Auth itself is NextAuth Credentials provider (`src/lib/auth.ts`), JWT session strategy, bcrypt password check, backed by the `User` Prisma model (`Role`: `MASTER | EDITOR | CLIENT`).

### Permission system (admin sidebar)

Beyond `Role`, admin users have a many-to-many `Permission` relation (named strings like `manage_site`, `manage_clients`, `manage_portfolio`, `manage_blog`, ...). `gestor/(admin)/layout.tsx` builds the sidebar menu from a static array of `{ href, permission, subItems }` entries and filters it against `user.permissions` — a menu item with `permission: 'any'` is always shown; anything else requires a matching `Permission.name`. `prisma/seed.ts` is the source of truth for what permission names exist. When adding a new admin section, add both the menu entry (with its `permission` key) and, if new, the permission row via the seed script.

### Server Actions + colocated forms convention

Every admin CRUD area follows the same shape:
- `actions.ts` at the route root — `'use server'`, one function per mutation (`createX`, `updateX`, `deleteX`, plus small toggles like `toggleFeaturedStatus`). Each does: parse `FormData` → Zod `safeParse` → Prisma call → `revalidatePath(...)` for every path that shows the data (typically the admin list, the admin edit page, and the corresponding public page(s)) → return `{ success, message }` (or `redirect()` on create).
- `_components/` folder (underscore = not a route) holding the client form component(s) for that page — `'use client'`, manages its own field state for character counters, drag-and-drop file inputs, etc., and calls the server action manually (not via plain `<form action>`) when it needs to upload a file first.
- `update*` actions diff the incoming validated fields against the current DB row field-by-field before writing, so a no-op save returns `'Nenhuma alteração detectada.'` instead of hitting the DB.

This pattern is duplicated across `novo/` (create) and `editar/[id]/` (edit) form components rather than shared — follow that existing duplication rather than introducing a shared abstraction, it's the established style here.

### File uploads

`/api/upload` (`src/app/api/upload/route.ts`) is a single generic endpoint: POST a file body with `?filename=`, it puts it to Vercel Blob (`@vercel/blob`, public access) and returns `{ url }`. Every image/PDF upload in the app (cover images, portfolio galleries, contract PDFs, etc.) goes through this one route from client components — there's no per-feature upload endpoint.

### Site CMS (`gestor/(admin)/site/*`)

Dynamic content for the public site (`inicio`, `sobre`, `servicos`, `aparencia`) is stored in small singleton-ish Prisma models (`HomePage`, `AboutPageContent`, `PageSettings`) or small ordered collections (`Testimonial`, `FaqItem`) rather than a generic CMS table. `getHomePageData()`-style helpers in each `actions.ts` do a `findFirst()` and lazily `create()` a default row if none exists yet.

YouTube links (hero video on `HomePage`, video on `PortfolioItem`) are stored as just the extracted 11-char video ID, never the full URL — `extractYouTubeId()` in the relevant `actions.ts` parses `watch?v=`, `youtu.be/`, `embed/`, and `shorts/` URL forms. A companion boolean (`youtubeVideoIsVertical` / `videoIsVertical`) records whether the link was a Shorts URL, so the public page can render a `9:16` container instead of forcing `16:9`.

### Domain model (Prisma)

`prisma/schema.prisma` is the single source of truth; key clusters:
- **CRM**: `Client` (1:1 with a `CLIENT`-role `User`) → `Contract` (`ContractStatus`) and `Project` (`ProjectStatus`) → `ProjectUpdate` (client-facing timeline entries).
- **Site content**: `HomePage`, `AboutPageContent`, `PageSettings`, `Testimonial`, `FaqItem`, `Service`, `PortfolioItem` (has `coverImage` + `galleryImages: String[]` + optional video).
- **Blog**: `Post`/`Category`/`Tag`/`Comment`/`PostVote` (anonymous voting via `VoteType`).
- **Notifications**: `Notification` (optionally `isBroadcast`) fanned out per-user via `UserNotificationStatus`.

### Swiper carousels

Multiple public-site carousels (`PortfolioSlider`, `TestimonialsSlider`, `PortfolioGallerySlider`, home hero, etc.) all use `swiper/react` with a shared custom-styled chrome defined once in `src/app/globals.css` (`.swiper-button-custom`, `.swiper-pagination-capsule`) rather than Swiper's default CSS skin. Each slider component supplies its own scoped `nextEl`/`prevEl`/pagination `el` class names and, if it needs positioning different from the shared defaults, adds a small scoped override block in `globals.css`. Arrows are globally hidden under 767px (`globals.css`) in favor of touch swipe + pagination dots — this is the established mobile-optimization pattern, don't re-implement it per component.

### UI components

shadcn/ui components live in `src/components/ui` (Tailwind + CVA + Radix primitives, `components.json` config: no prefix, CSS variables, slate base). Brand color is `m2-green` (`#97f901`, `tailwind.config.ts`) — used as the primary accent (buttons, active states, badges) with black text for guaranteed contrast on the bright green, and green-tinted borders/glows elsewhere. Prefer `bg-background`/`text-foreground`-style theme tokens (via the shadcn primitives) over hardcoded `gray-*` Tailwind classes so components render correctly in both light and dark mode — hardcoded dark grays on an `Input`/`Card` are a recurring bug source here since the admin panel supports theme switching.

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:port/db"   # Supabase Postgres
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
BLOB_READ_WRITE_TOKEN="..."                                 # Vercel Blob
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="..."                        # Google reCAPTCHA v2 site key — used by the contact form and both login forms (gestor + cliente). If unset, those forms show a fallback message instead of a permanently-disabled submit button.
RECAPTCHA_SECRET_KEY="..."                                  # Google reCAPTCHA v2 secret key — verified server-side in src/lib/auth.ts's authorize() on every credentials login. Required: if unset, login fails closed (denies all logins) rather than skipping verification.
CRON_SECRET="..."                                           # Bearer token required by /api/cron/reviews (see vercel.json). Required: if unset, the route fails closed (401s every request) rather than becoming public.
```
