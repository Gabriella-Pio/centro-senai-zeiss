# Design System
## SENAI Metrology Platform (SMP)

Versão: 1.0

---

# Objetivo

Este documento define todos os padrões visuais, componentes, diretrizes de experiência do usuário e identidade visual da plataforma.

O objetivo é garantir consistência visual, reutilização de componentes, acessibilidade e facilidade de manutenção durante todo o desenvolvimento.

Este documento deve servir como referência para designers, desenvolvedores frontend e backend.

---

# Conceito da Marca

A plataforma deve transmitir imediatamente os seguintes conceitos:

- Precisão
- Engenharia
- Tecnologia
- Inovação
- Confiabilidade
- Organização
- Qualidade
- Alto padrão técnico

O usuário deve sentir que está utilizando uma plataforma pertencente a uma empresa global de engenharia.

Não deve lembrar um site acadêmico.

Não deve parecer um portal governamental.

Não deve parecer um ERP tradicional.

A sensação desejada é semelhante aos produtos da Apple, ZEISS, Siemens, Hexagon Manufacturing Intelligence e Vercel.

---

# Personalidade da Interface

A interface deve transmitir:

Calma

Precisão

Modernidade

Confiança

Minimalismo

Elegância

Organização

---

# Princípios de Design

## Clareza

Toda informação deve ser facilmente encontrada.

Nunca esconder informações importantes.

---

## Hierarquia

Cada tela deve possuir apenas um foco principal.

A atenção do usuário deve ser conduzida naturalmente.

---

## Consistência

Botões iguais devem possuir o mesmo comportamento.

Cards iguais devem possuir a mesma estrutura.

Espaçamentos devem seguir uma escala fixa.

---

## Feedback

Toda ação deve possuir resposta visual.

Exemplos:

Loading

Toast

Skeleton

Success

Error

Hover

Focus

Disabled

---

## Performance Percebida

Sempre utilizar Skeleton ao invés de spinner.

Evitar telas vazias.

Mostrar feedback imediatamente.

---

# Identidade Visual

## Cores

### Primary

Inspirada no Azul ZEISS

#0057B8

Uso:

Botões primários

Links

Elementos ativos

Gráficos

Ícones principais

---

### Primary Hover

#00489A

---

### Secondary

#0F172A

Cinza escuro azulado.

Uso:

Navbar

Sidebar

Footer

---

### Accent

#00B8D9

Pequenos destaques.

Nunca utilizar em excesso.

---

### Background

#F8FAFC

---

### Surface

#FFFFFF

---

### Surface Secondary

#F1F5F9

---

### Border

#E2E8F0

---

### Text Primary

#0F172A

---

### Text Secondary

#475569

---

### Success

#16A34A

---

### Warning

#F59E0B

---

### Error

#DC2626

---

### Info

#2563EB

---

# Dark Mode

Background

#020617

Surface

#0F172A

Cards

#1E293B

Border

#334155

Texto

#F8FAFC

---

# Tipografia

Fonte principal

Geist

Fallback

Inter

System UI

---

## Escala

Display

56px

Bold

---

Heading 1

40px

Bold

---

Heading 2

32px

Semibold

---

Heading 3

24px

Semibold

---

Heading 4

20px

Medium

---

Body Large

18px

Regular

---

Body

16px

Regular

---

Caption

14px

Regular

---

Small

12px

Medium

---

# Grid

Desktop

12 colunas

Container

1280px

Padding

32px

---

Tablet

8 colunas

---

Mobile

4 colunas

Padding

20px

---

# Espaçamento

Utilizar escala baseada em 8.

4

8

16

24

32

40

48

64

80

96

128

Nunca utilizar valores aleatórios.

---

# Border Radius

Small

8px

Medium

12px

Large

16px

XL

24px

Pill

999px

---

# Sombras

Nível 1

Cards

Nível 2

Dropdown

Nível 3

Dialogs

Nível 4

Drawer

Nunca utilizar sombras exageradas.

---

# Motion

Biblioteca

Framer Motion

Duração padrão

0.25 segundos

Ease

easeInOut

---

## Hover

Scale

1.02

---

## Botões

TranslateY

-2px

---

## Cards

Elevação suave

---

## Hero

Fade

Slide

Parallax leve

---

# Ícones

Biblioteca

Lucide React

Tamanho

16

20

24

32

Nunca misturar bibliotecas.

---

# Botões

## Primary

Background Primary

Texto branco

Radius Large

Hover

Escurecer

Leve elevação

---

## Secondary

Background branco

Border

Primary

---

## Ghost

Sem fundo

Hover Surface

---

## Danger

Vermelho

---

# Inputs

Altura

48px

Radius

12px

Placeholder cinza

Focus

Anel azul

Erro

Borda vermelha

Mensagem abaixo

---

# Cards

Todos os cards devem possuir:

Título

Descrição

Ícone ou imagem

Espaçamento interno

Hover

Elevação suave

---

# Navbar

Altura

80px

Sticky

Blur

Background translúcido

Logo esquerda

Links centro

CTA direita

---

# Footer

Grande

Institucional

Links rápidos

Contato

Redes sociais

Copyright

---

# Hero

Altura

100vh

Título grande

Modelo 3D

CTA Principal

CTA Secundário

Background com grid discreto

Animações suaves

---

# Tabelas

Utilizar TanStack Table

Linhas

56px

Header fixo

Pesquisa

Ordenação

Filtros

Paginação

---

# Dashboard

Cards

Gráficos

Tabela

Timeline

Atividades recentes

Tudo modular.

---

# Empty States

Toda tela sem dados deve possuir:

Ilustração simples

Título

Descrição

Botão de ação

Nunca deixar áreas vazias.

---

# Skeleton

Utilizar Skeleton para:

Cards

Tabelas

Inputs

Dashboard

Listas

---

# Toasts

Biblioteca

Sonner

Tipos

Success

Info

Warning

Error

---

# Dialogs

shadcn/ui

Blur

Animação

Esc

Overlay

---

# Sidebar

Largura

280px

Colapsável

Ícones Lucide

Tooltip quando recolhida

---

# Microinterações

Botões

Hover

Focus

Active

Cards

Elevação

Links

Underline animado

Inputs

Glow azul

Sidebar

Transição suave

Dashboard

Cards animados ao carregar

---

# Responsividade

Desktop

≥1280

Notebook

1024

Tablet

768

Mobile

390

Toda funcionalidade deve existir em todas as resoluções.

---

# Acessibilidade

Contraste WCAG AA

Navegação completa por teclado

ARIA Labels

Skip Navigation

Focus Ring

Alt em imagens

Labels em todos os inputs

---

# SEO

Metadata dinâmica

Open Graph

Twitter Card

JSON-LD

robots.txt

sitemap.xml

Canonical URL

---

# Performance

Lighthouse

Performance >95

Accessibility >95

SEO >95

Best Practices >95

---

# Componentes Base

Button

Input

Textarea

Select

Checkbox

Radio

Switch

Dialog

Drawer

Sheet

Tabs

Accordion

Card

Badge

Avatar

Table

DataTable

Pagination

Tooltip

Popover

Toast

Alert

Breadcrumb

Timeline

Stepper

Carousel

MetricCard

ChartCard

FileUpload

ImageViewer

PDFViewer

LoadingOverlay

Skeleton

Navbar

Sidebar

Footer

Hero

Section

Container

PageHeader

SearchBar

FilterPanel

StatusBadge

EmptyState

ErrorState

ConfirmationDialog

---

# Filosofia

A interface deve parecer um software industrial premium.

Toda decisão de design deve responder à seguinte pergunta:

"Isso transmite confiança suficiente para que uma grande empresa envie uma peça de alto valor para análise neste laboratório?"

Se a resposta for "não", o componente deve ser redesenhado.
