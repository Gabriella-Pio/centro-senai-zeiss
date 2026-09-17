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

Node.js 22+ e Docker (Postgres em `apps/api/docker-compose.yml`).

Na raiz, uma vez:

```bash
npm install
```

Copie `apps/api/.env.example` para `apps/api/.env` (e `apps/web/.env.example` para `apps/web/.env.local` se for o site público).

**Área da equipe + API + banco** (o que você usa no dia a dia agora):

```bash
npm run dev
```

Sobe o Postgres se estiver parado, espera ele ficar pronto, e abre a API (`:3333`) e o app (`:3001`). Ctrl+C mata API e app; o container do banco continua.

Site público junto:

```bash
npm run dev:all
```

Os três ainda existem separados, se quiser um de cada vez: `dev:api`, `dev:app`, `dev:web`. Banco sozinho: `npm run db:up`.

Primeira vez no banco (ou depois de puxar migrations):

```bash
npm run db:migrate
npm run prisma:seed -w @cem/api
```

## Documentação

O “como ligar” é este README. Arquitetura, decisões, desafios e o que ainda é o módulo interno estão em [`docs/`](./docs/).
