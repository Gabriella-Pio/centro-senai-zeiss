# Arquitetura

O Centro de Excelência em Metrologia SENAI ZEISS tem **dois produtos** no mesmo repositório. O visitante nunca vê o que a equipe usa para orçar.

```text
navegador
  ├─ apps/web   site público     localhost:3000   (produção: cemsenaizeiss.com.br)
  └─ apps/app   módulo interno   localhost:3001   (produção: app.cemsenaizeiss.com.br)
        │
        └─ apps/api   NestJS     localhost:3333
              └─ PostgreSQL      localhost:5433 (Docker em apps/api/docker-compose.yml)
```

`packages/ui` (`@cem/ui`) concentra tokens e primitivos visuais compartilhados.

## O que cada app faz

**`apps/web` — vitrine.** Home, catálogo com ficha por serviço, orçamento, institucional, contato, termos e privacidade. PT sem prefixo; EN e DE em `/en` e `/de`. Não lista lead, não mostra preço, não tem `/admin`.

**`apps/app` — área da equipe.** Hoje é um placeholder. Vai concentrar login, registros de orçamentação e o Assistente. Valores e margens ficam só aqui.

**`apps/api` — contrato.** Nesta fase a superfície pública é `POST /api/v1/leads` (criar solicitação) e um health check. Listar ou alterar lead só volta com autenticação.

## Fluxo de um orçamento público

1. A pessoa preenche o formulário em `/quote` (empresa, responsável, e-mail, telefone/CNPJ, serviços, descrição).
2. O Next envia `POST` para `NEXT_PUBLIC_API_URL` (`/leads`).
3. O Nest valida, grava no Postgres e devolve sucesso.
4. A tela pública só confirma o envio. Quem lê o pedido é a equipe, no banco — até existir a área interna.

Sem API e banco no mesmo ambiente, o catálogo abre e o formulário falha.

## Site público (rotas)

| Caminho (PT) | Página |
|---|---|
| `/` | Home |
| `/services` | Catálogo |
| `/services/[serviço]` | Ficha |
| `/quote` | Orçamento |
| `/institutional` | Institucional |
| `/contact` | Contato |
| `/privacy`, `/terms` | Legal |
| qualquer outro | 404 do site (navbar + CTAs) |

Copy e metadados vivem em `apps/web/src/copy/` (catálogo tipado `pt` / `en` / `de`), não num CMS.

## Stack e por quê

| Camada | Escolha | Motivo curto |
|---|---|---|
| Site e app | Next.js App Router, React, TypeScript | Mesmo idioma nos dois fronts; rotas e i18n no App Router |
| Estilo | Tailwind + `@cem/ui` | Um sistema visual, dois hosts |
| Idioma | next-intl, `localePrefix: as-needed` | PT é o produto; EN/DE existem sem poluir a URL principal |
| API | NestJS | Validação e CORS no servidor, separado da vitrine |
| Dados | Prisma + PostgreSQL | Relacional, migrações no Git, Docker só no banco por enquanto |

O desafio permite stack livre, com justificativa. Não seguimos Java 11 / React 16 / SQL Server dos papéis GETIN: são EOL. O que levamos deles é o princípio (duas camadas, dado sensível fora do Git, JWT httpOnly quando houver login) — detalhe em [gc.md](./gc.md) e em [decisoes.md](./decisoes.md).
