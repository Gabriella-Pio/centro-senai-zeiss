# Gestão do conhecimento

O módulo interno vive em `apps/app` (`http://localhost:3001`). Não entra no site público.

## Fatia 1 — login

Há um único usuário no seed:

- e-mail: `admin@laboratorio.local`
- senha: `senai-zeiss`
- papel: Administrador

O cookie de sessão é `cem_session` (httpOnly, 8 h). Os outros três papéis ainda **não** existem como contas: o Admin vai cadastrá-los na fatia 2.

## Como subir local

1. Postgres local na porta `5433` (`docker start senai-zeiss-postgres` se o container já existir).
2. Em `apps/api/.env`: `DATABASE_URL`, `FRONTEND_URL=http://localhost:3000,http://localhost:3001`, `JWT_SECRET`.
3. `npm run prisma:generate -w @cem/api` e `npm run prisma:seed -w @cem/api`.
4. `npm run dev:api` e `npm run dev:app`.
5. Abrir `http://localhost:3001/login`.

## Mapa (do complemento) — ainda não nesta fatia

1. Vocabulário controlado
2. Registro em blocos A / B / C
3. Assistente honesto na escada 0 / 1–4 / 5–14 / 15+ casos
4. Validação e aviso ao orçamentista
5. Indicadores
6. Demonstração marcada e apagável; histórico real separado

## O que já está decidido

- Preço e margem **nunca** no `apps/web`
- Login com cookie **httpOnly**, não `localStorage`
- CORS fechado (`FRONTEND_URL`); lead público só cria
- PII e casos reais fora do Git; demo versionada e apagável
- Stack do desafio (Next / Nest / Postgres), não Java 11 / SQL Server
