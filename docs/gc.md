# Gestão do conhecimento

O módulo interno vive em `apps/app` (`http://localhost:3001`). Não entra no site público.

## Contas do laboratório (seed)

Senha de todas: `senai-zeiss`

| Papel | Nome | E-mail |
|-------|------|--------|
| Administrador | Matheus | `matheus@laboratorio.local` |
| Validador | Sebastião | `sebastiao@laboratorio.local` |
| Técnico | João | `joao@laboratorio.local` |
| Consulta | Estagiário | `consulta@laboratorio.local` |

Também existe `admin@laboratorio.local` (alias administrativo).

## Como subir local

```bash
npm run dev
```

Sobe Postgres, API (`:3333`) e o app (`:3001`). Abrir `http://localhost:3001/login`.

```bash
npm run db:migrate
npm run prisma:seed -w @cem/api
```

## Modo apresentação (híbrido)

- `NEXT_PUBLIC_DEMO_MODE=false` — login real via API
- Fluxo GC (solicitações, registros, assistente, validação, indicadores) em `localStorage` (`cem_demo_state`)
- Banner “Modo demonstração” em todas as telas internas

## Modo ensaio offline

```bash
# apps/app/.env.local
NEXT_PUBLIC_DEMO_MODE=true
```

Login com atalhos “Entrar como…” na tela de login. Sem Postgres obrigatório.

## O que é real vs mock

| Real (back) | Mock (front / localStorage) |
|-------------|----------------------------|
| Login, sessão, papéis | Solicitações internas |
| POST `/leads` da vitrine | Registros A/B/C |
| Gestão de usuários (Admin) | Vocabulário |
| | Assistente, validação, indicadores |
| | Notificações |

## Roteiro de apresentação (~20 min)

1. **Vitrine** — catálogo + formulário de orçamento
2. **Matheus** — Solicitações → em análise → converter em registro
3. **João** — Assistente (tipo + traits) → faixa/confiança → criar registro
4. **João** — Registros → blocos B e C → concluir serviço
5. **Sebastião** — Validação → formalizar lição → notificação no sino
6. **João** — Assistente de novo → recomendação mudou
7. **Indicadores** — assertividade e causas frequentes

## Peças do complemento

1. Área interna com perfis — login + nav por papel
2. Registro de serviço — blocos A, B, C com regra de conclusão
3. Vocabulário controlado — Admin edita; todos consultam
4. Assistente honesto — escada 0 / 1–4 / 5–14 / 15+ casos
5. Validação e aviso — fila de lições + sino
6. Indicadores — só base demo formalizada

## Decisões

- Preço e margem **nunca** no `apps/web`
- Histórico real começa vazio; demo versionada e apagável
- PII de clientes reais fora do Git
