# Briefing completo — Módulo interno de Gestão do Conhecimento em Orçamentação
## Centro de Excelência em Metrologia SENAI ZEISS

---

## CONTEXTO DO PROJETO

Este é um projeto de processo seletivo (Programa de Intercâmbio ZEISS Alemanha). O repositório tem **dois produtos separados**:

| App | Host | Público | O que faz |
|-----|------|---------|-----------|
| `apps/web` | localhost:3000 / cemsenaizeiss.com.br | Clientes externos | Vitrine institucional, catálogo, formulário de orçamento. **Nunca** mostra preço, margem ou dados internos. |
| `apps/app` | localhost:3001 / app.cemsenaizeiss.com.br | Equipe do laboratório | Módulo interno de Gestão do Conhecimento (GC) em orçamentação. **É este módulo que quero reconstruir do zero.** |
| `apps/api` | localhost:3333 | Backend | NestJS + Prisma + PostgreSQL. Hoje: login real, usuários, POST de leads da vitrine. |

**Decisão arquitetural inegociável:** preço, margem e desempenho financeiro **nunca** aparecem no site público. O módulo interno vive em host separado.

**Minha decisão agora:** não gostei do design nem das funções da implementação atual em `apps/app`. Quero **começar do zero** — pode ser até um protótipo em HTML/CSS/JS puro, sem Next.js, só para validar UX e fluxo antes de integrar de novo ao monorepo. O importante é ficar **visualmente melhor**, **mais coerente** e **mais útil para quem orça**.

---

## O PROBLEMA QUE O MÓDULO RESOLVE

O laboratório de metrologia orça de memória. Quando chega um pedido, alguém estima horas e preço com base na experiência ("já vi peça parecida", "essa fixação dá trabalho"). Isso funciona, mas:
- não fica registrado de forma comparável
- não melhora sozinho ao longo do tempo
- a memória se perde quando alguém sai

O módulo interno existe para fechar este ciclo:

```
Cliente pede orçamento → equipe estima → executa → compara orçado vs realizado
→ registra o aprendizado → próximo orçamento já usa esse histórico
```

**Não é um ERP.** Não é agenda de máquina, estoque, OS de manutenção nem fila de trabalho do técnico.

---

## O QUE O DESAFIO PEDE (ciclo Vallejos)

O complemento do desafio pede o ciclo:

**orçar → executar → comparar → aprender → recomendar**

Regra de ouro: **se a tela não alimenta nem consome esse ciclo, ela está fora do módulo.**

### O que NÃO fazer (fora de escopo)
- Controle de estoque
- Calendário / agenda de equipamento
- Motor de workflow configurável
- Fila "meus serviços" do técnico na sidebar
- CMMS (manutenção preventiva, peças, vida útil de ativos)
- Descontar hora de manutenção automaticamente
- Anexos de cliente real no Git (PII fora do repositório)

### O que É escopo
- Vocabulário controlado (classificação padronizada, não texto livre)
- Registro de serviço com blocos A/B/C
- Assistente de orçamento honesto (não inventar faixa com pouco histórico)
- Validação de lições aprendidas
- Indicadores de evolução do conhecimento
- Ponte comercial fina (solicitações vindas da vitrine)
- Tarifas de hora-máquina visíveis e usadas na composição de custo

---

## DOIS CICLOS DISTINTOS (não confundir)

### 1. Ciclo comercial (ponte fina)
```
Formulário da vitrine → Solicitação interna → Admin/Validador analisa → Converte em registro
```
A solicitação **não é o núcleo do GC**. É só a entrada comercial.

### 2. Ciclo de conhecimento (núcleo do módulo)
```
Registro bloco A (orçado) → Execução → Bloco B (realizado) + Bloco C (aprendizado)
→ Validação da lição → Entra no histórico → Assistente recomenda no próximo orçamento
```

**Solicitação e registro são objetos diferentes:**
- Solicitação: `SO-2026-0004` — lead do site
- Registro: `RS-2026-0001` — serviço no laboratório (rastreio tipo Inmetro/ISO)

---

## PERSONAS DO LABORATÓRIO (usar na apresentação)

Senha de todas as contas: `senai-zeiss`

| Papel | Nome | E-mail | O que faz | O que NÃO faz |
|-------|------|--------|-----------|---------------|
| **Administrador** | Matheus (coordenador) | `matheus@laboratorio.local` | Tudo do Validador + usuários + vocabulário + tarifas + apagar demo | — |
| **Validador** | Sebastião (analista STI) | `sebastiao@laboratorio.local` | Tudo do Técnico + formalizar/superar lições + ver solicitações | Não é dono exclusivo da caixa de entrada |
| **Técnico** | João | `joao@laboratorio.local` | Criar/editar registros, usar Assistente, preencher blocos A/B/C, enviar lição | Não gerencia usuários, vocabulário nem formaliza conhecimento |
| **Consulta** | Estagiário | `consulta@laboratorio.local` | Ver registros públicos, indicadores e Assistente (somente leitura) | Não edita nada; nunca vê registros restritos |

Também existe `admin@laboratorio.local` (alias administrativo).

**Hierarquia:** Validador inclui Técnico. Admin inclui Validador.

---

## TELAS DO MÓDULO E QUEM VÊ O QUÊ

### Trabalho (ciclo do complemento)
| Tela | Quem vê | Quem edita |
|------|---------|------------|
| **Home / Dashboard** | Todos | — |
| **Assistente de orçamento** | Todos | Técnico+ cria registro a partir daqui |
| **Registros de serviço** | Todos | Técnico+ cria/edita; Consulta só lê |
| **Vocabulário** | Todos | Admin edita termos e tarifas |
| **Validação** | Validador, Admin | Validador formaliza lições |
| **Indicadores** | Todos | Calculados automaticamente |

### Gestão
| Tela | Quem vê |
|------|---------|
| **Solicitações** | Admin, Validador |
| **Equipe / Usuários** | Admin |
| **Meu perfil** | Todos |

### Elementos globais
- **Sino de notificações** no header (badge + painel dropdown)
- **Banner "Dados da demonstração"** em todas as telas internas
- **Nav lateral** filtrada por papel do usuário logado

**Não ter na sidebar:** "Serviços do João", kanban de trabalho, agenda de máquina.

---

## REGISTRO DE SERVIÇO — MODELO CENTRAL

### Dois estados independentes (não misturar)

**Estado do serviço:**
1. `DRAFT` — Rascunho (bloco A incompleto)
2. `QUOTED` — Orçado / em execução (bloco A completo)
3. `COMPLETED` — Concluído (blocos A + B + C preenchidos)

**Estado da lição:**
1. `DRAFT` — Não entra no Assistente
2. `PENDING` — Em validação (não entra no Assistente)
3. `FORMALIZED` — Entra nas recomendações do Assistente
4. `SUPERSEDED` — Consultável, mas para de influenciar

**Regra inegociável:** o serviço **não fecha** sem blocos B e C preenchidos.

### Bloco A — Orçado (quando a proposta sai)
- Tipo de serviço → **do vocabulário** (não texto livre)
- Características da peça → **do vocabulário** (chips/tags selecionáveis)
- Recursos do laboratório → **do vocabulário** (equipamentos, sala, software)
- Horas de equipe estimadas
- Horas de equipamento estimadas
- **Composição de custo calculada** (equipe + máquinas com tarifas)
- **Valor proposto** (com sugestão automática)
- Premissas / observações
- Quem estimou (nome do usuário logado)
- Se horas ou valor divergem da sugestão do Assistente → **justificativa obrigatória**

### Bloco B — Realizado (quando o serviço fecha)
- Horas reais
- Custo real
- Valor faturado
- Data de entrega
- Retrabalho? (sim/não)
- Mudança de escopo? (sim/não)

### Bloco C — Aprendizado (junto com B)
- Causa do desvio → **do vocabulário**
- Lição aprendida (texto)
- Assuntos relacionados (termos do vocabulário)
- Sigilo: `PUBLIC` (interno público) ou `RESTRICTED` (só Validador e Admin)

### Sigilo
- Quem preenche o C **propõe** o sigilo
- Validador **confirma** na formalização
- Consulta **nunca** vê restrito
- Só lição `FORMALIZED` e não `SUPERSEDED` entra no Assistente

### Registro pode nascer sem solicitação
Telefone, ordem antiga, semente da entrevista — botão "Novo registro" na tela de registros.

---

## VOCABULÁRIO CONTROLADO

**Problema que resolve:** sem vocabulário, cada técnico descreve diferente ("peça grande" vs "peça de grande porte") e o Assistente não consegue agrupar casos.

### Classes de termos
| Classe | Exemplos | Observação |
|--------|----------|------------|
| `SERVICE_TYPE` | Inspeção dimensional, Digitalização 3D, Engenharia reversa, Tomografia industrial | O que o Assistente agrupa |
| `PART_TRAIT` | Superfície livre, Tolerância apertada, Material, Porte, GD&T | Características da peça |
| `RESOURCE` | CMM ZEISS CONTURA, Scanner ATOS, Tomógrafo, Sala climatizada | **Cada um com tarifa R$/h** |
| `DEVIATION_CAUSE` | Fixação complexa, Programação subestimada, Mudança de escopo | Causas de desvio |

### Regras
- **Ver:** os 4 perfis
- **Editar:** só Admin
- Termos inativos não aparecem em selects
- **Não deixar crescer por texto livre** no registro
- Crescimento ideal: técnico sugere termo → Admin publica com orientação de uso

### Catálogo público ≠ tipo de serviço interno
O site vende em categorias amplas. O vocabulário compara em tipos finos.
- Form público manda serviço de catálogo
- Na conversão, Admin escolhe o **tipo de serviço do vocabulário**

### Tarifas (planilha hora-máquina)
Recursos do tipo `RESOURCE` têm campo `hourlyRate` (R$/h).
Exemplos de tarifas demo:
- CMM / Máquina de medição: R$ 380/h
- Scanner 3D ATOS: R$ 420/h
- Tomógrafo industrial: R$ 650/h
- Sala climatizada: R$ 48/h
- Equipe técnica (config global): R$ 95/h
- Margem alvo: 35%

---

## ASSISTENTE DE ORÇAMENTO (peça central da banca)

O Assistente é a **estrela da apresentação**. Deve ser honesto e rastreável.

### Entrada
1. Tipo de serviço (vocabulário)
2. Características da peça (vocabulário, multi-select)
3. Recursos do laboratório (vocabulário, multi-select, com tarifa visível)
4. Horas de equipe e de equipamento

### Saída — duas dimensões

**A) Recomendação de esforço (horas)**
Baseada em casos formalizados similares (mesmo tipo de serviço + traits em comum).

Escada de confiança:
| Casos formalizados | Nível | Comportamento |
|--------------------|-------|---------------|
| 0 | Sem histórico | Não inventar faixa. Mostrar roteiro de premissas do vocabulário. |
| 1–4 | Confiança baixa | Mostrar casos, avisar que são poucos. |
| 5–14 | Confiança média | Mediana + quartis (Q1–Q3) dos casos. |
| 15+ | Confiança alta | Mediana + quartis + fator de correção (média de realizado/estimado). |

Deve mostrar: quantos casos, quais registros foram usados (clicável/listável), mediana, faixa Q1–Q3, fator de correção.

**B) Composição de custo e preço (CRÍTICO — estava faltando na v1)**
- Tabela de composição: item | horas | tarifa | subtotal
- Linha de equipe técnica (horas × R$/h da equipe)
- Linha por recurso selecionado (horas de equipamento divididas × tarifa R$/h)
- **Custo estimado total**
- **Preço sugerido** = custo / (1 − margem alvo)
- **Histórico de preços** dos casos formalizados (mediana, faixa Q1–Q3)
- Se o técnico informa valor diferente do sugerido → **justificativa obrigatória**
- Botão "Usar valor sugerido"

### Ação final
"Criar registro com este orçamento" → gera registro rascunho com bloco A pré-preenchido.

---

## SOLICITAÇÕES (ponte comercial)

### Status e transições
| De | Para | Quando |
|----|------|--------|
| `NEW` | `IN_REVIEW` | Alguém abriu e assumiu |
| `NEW` | `ARCHIVED` | Spam/teste/duplicata (com justificativa) |
| `IN_REVIEW` | `CONVERTED` | Vai virar registro de verdade |
| `IN_REVIEW` | `ARCHIVED` | Recusado/fora de escopo (com justificativa) |
| `CONVERTED` | — | Estado final; ciclo passa ao registro |

### Campos da solicitação
- Número (`SO-2026-0004`)
- Empresa, solicitante, e-mail, telefone
- Serviço solicitado (texto do form público)
- Mensagem/descrição
- Data de recebimento
- Status
- Número do registro vinculado (quando convertida)
- Motivo de arquivamento (quando arquivada)

### Ações
- Assumir / colocar em análise
- Converter em registro (cria `RS-` rascunho com dados puxados)
- Arquivar (com justificativa obrigatória)
- Simular pedido do site (para demo)

### Notificações
- Novo pedido da vitrine → notifica Admin e Validador
- Lição aguardando validação → notifica Validador e Admin
- Converter solicitação → notificação

---

## VALIDAÇÃO

Tela para Validador e Admin.

- Fila de lições com status `PENDING`
- Mostra: número do registro, empresa, serviço, lição escrita, causa do desvio, sigilo proposto
- Ações: **Formalizar** (lição entra no histórico do Assistente) ou **Superar** (marca como obsoleta)
- Ao formalizar → notificação no sino

---

## INDICADORES

Calculados a partir da base de demonstração formalizada (com banner avisando que são dados demo).

Métricas:
- Casos formalizados (total)
- Assertividade de esforço (±15% entre estimado e realizado)
- Desvio médio de esforço (%)
- **Margem média realizada** (%)
- **Serviços abaixo da meta de margem** (contagem)
- Top 3 causas de desvio mais frequentes

---

## DEMONSTRAÇÃO vs HISTÓRICO REAL

| Aspecto | Base real | Base demo |
|---------|-----------|-----------|
| Origem | Operação do laboratório | Seed versionada |
| Estado inicial | Vazia | 15+ registros formalizados |
| Indicadores | Futuro | Marcados como "dados da demonstração" |
| Apagável | Não | Sim (ação do Admin) |
| PII | Cliente vira código, não nome no Git | Nomes fictícios |

Chave localStorage: `cem_demo_state`

### Modos de execução
- **Apresentação (híbrido):** `NEXT_PUBLIC_DEMO_MODE=false` — login real via API, fluxo GC em localStorage
- **Ensaio offline:** `NEXT_PUBLIC_DEMO_MODE=true` — atalhos "Entrar como…" na login, sem Postgres

---

## ROTEIRO DE APRESENTAÇÃO (~20 min)

1. **Vitrine** — catálogo + formulário de orçamento público
2. **Matheus** (Admin) — Solicitações → colocar em análise → converter em registro
3. **João** (Técnico) — Assistente → selecionar tipo + traits + recursos → ver composição de custo e preço sugerido → criar registro
4. **João** — Registros → completar blocos B e C → concluir serviço
5. **Sebastião** (Validador) — Validação → formalizar lição → notificação no sino
6. **João** — Assistente de novo (mesmo perfil) → **recomendação mudou** (prova que o ciclo funciona)
7. **Indicadores** — assertividade, margem, causas frequentes

---

## O QUE ESTAVA ERRADO NA IMPLEMENTAÇÃO ANTERIOR (não repetir)

### Design / UX
- Visual genérico, sem identidade própria do laboratório
- Layout de "admin dashboard" padrão, sem hierarquia clara
- Fluxo pouco guiado — usuário não entende o ciclo A→B→C
- Assistente não parecia a peça central
- Composição de custo escondida ou secundária

### Funcional / produto
- Assistente sugeria só horas, não valor
- Campos de preço eram livres, sem análise
- Planilha hora-máquina não aparecia visualmente no sistema
- Existia `horas × 320` hardcoded sem explicação
- `estimatedCost` existia no tipo mas não na tela
- Recursos no vocabulário sem tarifa R$/h visível
- Sensação de "cadastro" em vez de "ferramenta que ajuda a orçar"

### O que o proponente do desafio pediu pessoalmente (além do PDF)
Um sistema **completo e coerente** que **assista de verdade** quem faz os orçamentos do laboratório — não só registre dados, mas **sugira valor com base em tarifas e histórico**, mostrando de onde veio cada número.

---

## DIREÇÃO DE DESIGN (o que eu quero agora)

### Referências visuais
- ZEISS, Siemens, Hexagon (industrial premium)
- Apple, Stripe, Vercel (clareza e hierarquia)
- Não parecer "template de admin genérico"

### Princípios
- **Mobile-first** mas usável em desktop (técnicos podem usar tablet no lab)
- WCAG AA (contraste, foco, labels)
- Tipografia com hierarquia clara (títulos, dados numéricos em mono)
- O Assistente deve ser a tela mais impactante visualmente
- Composição de custo deve ser **impossível de ignorar** — tabela clara, totais destacados
- Mostrar o ciclo visualmente (A → B → C → Validação → Assistente)
- Banner demo discreto mas sempre visível
- Cores: pode seguir tokens SENAI/Zeiss (azul institucional) mas com layout próprio

### Abordagem técnica sugerida para o protótipo
- **Pode ser HTML + CSS + JS puro** (sem framework) para iterar rápido no design
- Ou React/Vanilla em pasta separada (`prototype/` ou `apps/app-v2/`)
- Dados em `localStorage` com seed JSON embutido
- Login simulado por seleção de persona (4 botões)
- Foco em: fluxo navegável, telas bonitas, interações que demonstrem o ciclo
- Integração com monorepo pode vir depois, quando o design estiver aprovado

---

## MODELO DE DADOS (referência)

### ServiceRecord
```typescript
{
  id: string
  recordNumber: string          // RS-2026-0001
  requestId?: string
  requestNumber?: string        // SO-2026-0003
  company: string
  service: string
  requester: string
  createdAt: string
  isDemo: boolean

  // Bloco A
  serviceTypeId?: string
  partTraitIds: string[]
  resourceIds: string[]
  estimatedHours: number | null
  estimatedEquipmentHours: number | null
  estimatedCost: number | null
  proposedValue: number | null
  assumptions: string
  estimatedBy?: string
  estimationOverrideReason?: string
  priceOverrideReason?: string
  serviceStatus: "DRAFT" | "QUOTED" | "COMPLETED"

  // Bloco B
  actualHours: number | null
  actualCost: number | null
  billedValue: number | null
  deliveredAt: string | null
  rework: boolean
  scopeChange: boolean

  // Bloco C
  deviationCauseId: string | null
  lesson: string
  relatedTopicIds: string[]
  visibility: "PUBLIC" | "RESTRICTED"
  lessonStatus: "DRAFT" | "PENDING" | "FORMALIZED" | "SUPERSEDED"
}
```

### QuoteRequest
```typescript
{
  id: string
  requestNumber: string         // SO-2026-0004
  linkedRecordNumber?: string
  requester: string
  company: string
  email: string
  phone: string
  service: string
  message: string
  receivedAt: string
  status: "NEW" | "IN_REVIEW" | "CONVERTED" | "ARCHIVED"
  archiveReason?: string
}
```

### VocabularyTerm
```typescript
{
  id: string
  label: string
  class: "SERVICE_TYPE" | "PART_TRAIT" | "RESOURCE" | "DEVIATION_CAUSE"
  guidance: string
  active: boolean
  updatedAt: string
  hourlyRate?: number           // só para RESOURCE
}
```

### LabSettings
```typescript
{
  teamHourlyRate: 95            // R$/h equipe
  targetMarginPercent: 35       // margem alvo
  tariffTableLabel: string      // "Tabela de tarifas — set/2026"
}
```

### Lógica de custo
```
custo_equipe = horas_equipe × tarifa_equipe
custo_recurso = (horas_equipamento / n_recursos) × tarifa_recurso  [por recurso]
custo_total = soma de todas as linhas
preco_sugerido = custo_total / (1 - margem_alvo/100)
margem_realizada = (preco - custo) / preco × 100
```

---

## SEED DE DEMONSTRAÇÃO (mínimo para o Assistente funcionar)

Precisa de **15+ registros formalizados** de "Inspeção dimensional" para o Assistente mostrar confiança alta na demo.

Cada registro formalizado deve ter:
- `lessonStatus: "FORMALIZED"`
- `serviceStatus: "COMPLETED"`
- `isDemo: true`
- Horas estimadas e reais (com desvios realistas)
- Custo e preço calculados pelas tarifas (não valores inventados)
- Causa de desvio e lição

Também incluir:
- 2–3 solicitações (1 nova, 1 em análise, 1 já convertida)
- Vocabulário com ~15 termos ativos nas 4 classes
- 4 recursos com tarifas
- 2 registros em andamento (rascunho e orçado)

---

## ENTREGÁVEIS ESPERADOS

1. **Protótipo navegável** com todas as telas listadas acima
2. **Fluxo completo** do roteiro de apresentação funcionando com mocks
3. **Assistente** como peça central — horas + custo + preço visíveis
4. **Design premium** — não parecer template genérico
5. **Responsivo** (mobile + desktop)
6. **Código organizado** — fácil de migrar para Next.js depois se o protótipo for aprovado

---

## O QUE NÃO PRECISA AGORA

- Backend real para registros/assistente (localStorage basta)
- WebSocket para notificações
- Upload de arquivos
- Integração com POST /leads da API
- Testes automatizados
- i18n (só PT-BR)

---

## COMO COMEÇAR

1. Propor wireframe ou estrutura de telas antes de codar
2. Começar pelo **Assistente** (tela mais importante) + **Registro A/B/C**
3. Depois: Solicitações, Validação, Indicadores, Vocabulário
4. Login por seleção de persona (4 botões)
5. Seed JSON com 15+ casos formalizados
6. Mostrar o ciclo visualmente em cada tela

Pergunte-me se algo estiver ambíguo. Priorize **utilidade para quem orça** e **clareza visual** sobre completude técnica.

---

## Uso sugerido em novo chat

1. Cole o prompt inteiro (ou referencie este arquivo).
2. Adicione no final: *"Comece propondo a estrutura de telas e o wireframe do Assistente antes de escrever código."*
3. Se quiser HTML puro: *"Use HTML/CSS/JS vanilla em uma pasta `prototype/gc/` no repositório."*
4. Se quiser manter no monorepo: *"Crie em `apps/app-v2/` sem mexer no `apps/app` atual."*
