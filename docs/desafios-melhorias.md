# Desafios e melhorias

## O que já doeu na vitrine

**Responsividade não é um breakpoint.** Celular e desktop fecharam primeiro. O tablet (~768–1023px) ainda herda layout de telefone se a foto ou o carrossel só “acordam” no `lg`. Ajustamos intro do laboratório e peek do parque; o hero continua empilhado até o desktop largo, de propósito.

**i18n quebra layout.** EN/DE alongam títulos. CTA em flex row no heading do parque vazava no celular — empilhamos abaixo de 768px.

**404 e next-intl.** `notFound()` no layout do `[locale]` não usa o `not-found.tsx` da mesma pasta. Sem catch-all e sem arquivo na raiz, o visitante via a tela preta do Next. A página branded já existia; o roteamento é que não a alcançava.

**Formulário depende de infra.** Validação e copy estão no Next; persistência está no Nest. Demonstrar orçamento sem API+Postgres no ar parece produto quebrado.

**Copy vs. logo.** A Faculdade SENAI Ítalo Bologna não tem marca própria. Quarto logo repetia o SENAI. Saímos da faixa e mantivemos a faculdade no texto.

## Melhorias — vitrine (antes ou junto do chefe)

- Subir **web + API + Postgres** num URL. Sem isso o teste dele para no formulário.
- Um jeito de **mostrar que o lead chegou** (consulta no banco, e-mail, ou a futura área interna).
- **Diferencial** visível no site público, justificado na banca — não o i18n, não o GC.
- Checkbox de privacidade no orçamento, se o laboratório pedir.
- Sitemap e `global-error` (quebra de React), que o desafio não lista mas o site de verdade usa.

## Melhorias — depois, com o GC

Login e quatro perfis, registro A/B/C, vocabulário editável, Assistente honesto (não inventar faixa com pouco histórico), indicadores, ciclo rascunho → formalizada. Documentar telas × ciclo Vallejos e o roteiro ao vivo. Ver [gc.md](./gc.md).
