# Centro de Excelência em Metrologia — SENAI × ZEISS

Dois produtos, um repositório:

- **Site institucional** (`apps/web`) — catálogo de serviços e solicitação de orçamento. Sem valores, margens ou área interna.
- **Módulo interno** (`apps/app`) — gestão do conhecimento em orçamentação, atrás de login. Ainda em construção.
- **API** (`apps/api`) — NestJS + Prisma + PostgreSQL.

Em produção a ideia é `cemsenaizeiss.com.br` (público) e `app.cemsenaizeiss.com.br` (equipe). Localmente: portas 3000, 3001 e 3333.

## Stack

- Next.js (App Router), Tailwind CSS, shadcn/ui
- NestJS, Prisma, PostgreSQL

## Estrutura

```text
centro-senai-zeiss/
  apps/web          # site público          → localhost:3000
  apps/app          # módulo interno        → localhost:3001
  apps/api          # API NestJS            → localhost:3333
  packages/ui       # tokens e primitivos shadcn (`@cem/ui`)
```

## Como rodar

Node.js 22+ e PostgreSQL (Docker opcional em `apps/api/docker-compose.yml`).

Na raiz:

```bash
npm install
```

API — copie `apps/api/.env.example` para `apps/api/.env`, suba o banco e:

```bash
npm run db:migrate
npm run dev:api
```

Site público — copie `apps/web/.env.example` para `apps/web/.env.local`:

```bash
npm run dev:web
```

Módulo interno (placeholder, ainda sem login):

```bash
npm run dev:app
```

O site público **não** tem rota `/admin`. A API pública de leads aceita só `POST /api/v1/leads` (criar solicitação). Listar e alterar lead volta quando existir autenticação.
