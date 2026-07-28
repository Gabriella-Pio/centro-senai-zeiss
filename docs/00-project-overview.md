# Software Design Specification (SDS)

# Projeto

SENAI Metrology Platform (SMP)

Versão: 1.0

Autor: Gabriella Pio Corrêa

---

# 1. Visão Geral

## Objetivo

Desenvolver uma plataforma web moderna para o Centro de Excelência em Metrologia do SENAI em parceria com a ZEISS, capaz de representar institucionalmente o laboratório, apresentar seus serviços de forma profissional, facilitar o relacionamento com empresas e otimizar o processo de solicitação e gerenciamento de orçamentos.

O projeto faz parte do processo seletivo para o Programa de Intercâmbio ZEISS Alemanha e foi concebido não apenas para atender aos requisitos mínimos do desafio, mas para representar uma solução que poderia ser utilizada em ambiente real.

---

# 2. O Problema

Atualmente o laboratório possui poucos canais digitais para divulgar seus serviços, estrutura e diferenciais.

Grande parte das empresas interessadas:

- não conhece todos os serviços oferecidos;
- não sabe qual tecnologia atende melhor sua necessidade;
- possui dificuldade para solicitar atendimento;
- depende de comunicação manual para acompanhamento de solicitações.

Isso gera perda de oportunidades comerciais, demora no atendimento e reduz a percepção de profissionalismo da instituição.

---

# 3. A Solução

A solução proposta consiste em uma plataforma web completa dividida em dois módulos.

## Portal Institucional

Voltado para clientes.

Objetivos:

- fortalecer a imagem institucional;
- apresentar os serviços;
- apresentar infraestrutura;
- apresentar equipamentos;
- divulgar certificações;
- facilitar contato;
- facilitar solicitação de orçamento.

---

## Plataforma Administrativa

Voltada para colaboradores do laboratório.

Objetivos:

- gerenciar solicitações;
- acompanhar leads;
- organizar o fluxo comercial;
- gerar propostas comerciais;
- acompanhar métricas;
- administrar o conteúdo do site.

---

# 4. Público-Alvo

## Empresas

Empresas que necessitam de:

- metrologia dimensional;
- engenharia reversa;
- digitalização 3D;
- tomografia industrial;
- inspeção dimensional;
- desenvolvimento de produto.

---

## Instituições

Universidades

Centros de Pesquisa

Startups

Instituições Públicas

---

## Colaboradores

Coordenador do laboratório

Engenheiros

Técnicos

Administradores

---

# 5. Objetivos do Produto

## Objetivos de negócio

- aumentar a visibilidade do laboratório;
- facilitar aquisição de novos clientes;
- melhorar o relacionamento comercial;
- profissionalizar a presença digital.

---

## Objetivos técnicos

- arquitetura escalável;
- código limpo;
- alta performance;
- excelente experiência do usuário;
- fácil manutenção;
- segurança;
- desacoplamento entre frontend e backend.

---

# 6. Proposta de Valor

A plataforma não será apenas um site institucional.

Ela será uma plataforma digital completa para gestão do relacionamento entre empresas e o Laboratório de Metrologia.

Seu principal diferencial será transformar o processo tradicional de solicitação de orçamento em um fluxo organizado de atendimento comercial.

---

# 7. Diferenciais

## Interface Premium

Inspirada em empresas globais de tecnologia industrial.

Referências:

- ZEISS
- Apple
- Siemens
- Hexagon Manufacturing Intelligence
- Coffee Tech
- Stripe
- Vercel

---

## Arquitetura Moderna

Frontend desacoplado.

Backend independente.

API REST.

Escalabilidade horizontal.

---

## SEO

Otimização para mecanismos de busca.

Server Side Rendering.

Metadata dinâmica.

Sitemap.

Robots.

Open Graph.

Schema.org.

---

## Performance

Lighthouse superior a 95.

Lazy Loading.

Code Splitting.

Image Optimization.

Caching.

---

## Responsividade

Desktop

Notebook

Tablet

Mobile

---

## Acessibilidade

WCAG AA.

Navegação por teclado.

ARIA Labels.

Contraste adequado.

Estados de foco.

---

## Dashboard Administrativo

Gerenciamento completo da plataforma.

---

## Gestão Comercial

Fluxo completo do atendimento desde a solicitação até a proposta comercial.

---

# 8. Módulos

## Portal Institucional

Home

Serviços

Página individual de serviços

Equipamentos

Área Institucional

Contato

Solicitação de Orçamento

FAQ

---

## Plataforma Administrativa

Dashboard

Leads

Solicitações

CRM

Clientes

Serviços

Equipamentos

Equipe

Parceiros

Certificações

Analytics

Configurações

Perfil

---

# 9. Fluxo Geral

Cliente

↓

Conhece o laboratório

↓

Explora serviços

↓

Solicita orçamento

↓

Administrador recebe notificação

↓

Analisa necessidade

↓

Calcula custos

↓

Gera proposta comercial

↓

Cliente recebe retorno

↓

Solicitação concluída

---

# 10. Principal Diferencial

O principal diferencial da plataforma será um módulo de Gestão Comercial.

Ao invés de apenas armazenar solicitações, a plataforma acompanhará todo o ciclo do atendimento.

Fluxo:

Lead

↓

Solicitação

↓

Análise Técnica

↓

Estimativa de Custos

↓

Proposta Comercial

↓

Negociação

↓

Aprovação

↓

Execução

↓

Conclusão

Esse módulo permitirá que o laboratório acompanhe cada oportunidade comercial, organize o histórico de atendimento e padronize a elaboração de propostas.

---

# 11. Stack Tecnológica

Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- React Three Fiber
- React Hook Form
- Zod
- TanStack Query

Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Swagger

Banco

- PostgreSQL

Storage

- Cloudinary

Deploy

Frontend → Vercel

Backend → Render

Banco → Supabase PostgreSQL

---

# 12. Princípios Arquiteturais

- SOLID
- Clean Architecture
- Clean Code
- DRY
- KISS
- Separation of Concerns
- Dependency Injection
- Repository Pattern
- Feature Based Architecture
- Atomic Design
- Composition Pattern

---

# 13. Requisitos Não Funcionais

Alta disponibilidade.

Escalabilidade.

Segurança.

Performance.

SEO.

Responsividade.

Acessibilidade.

Baixo tempo de carregamento.

Código padronizado.

Documentação completa.

---

# 14. Resultado Esperado

Ao final do projeto, espera-se entregar uma plataforma profissional capaz de:

- representar institucionalmente o laboratório;
- facilitar o contato entre empresas e o SENAI;
- organizar o fluxo de atendimento;
- centralizar solicitações;
- oferecer excelente experiência ao usuário;
- servir como base para uma futura implantação oficial pelo Laboratório de Metrologia.

