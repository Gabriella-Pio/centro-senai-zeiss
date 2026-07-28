# System Architecture

## SENAI Metrology Platform (SMP)

Versão: 1.0

---

# Objetivo

Este documento descreve toda a arquitetura técnica da plataforma.

O objetivo é garantir:

- escalabilidade;
- desacoplamento;
- alta manutenção;
- facilidade para evolução futura;
- baixo acoplamento entre frontend e backend;
- excelente experiência de desenvolvimento.

Toda decisão arquitetural foi tomada considerando uma futura utilização da plataforma em ambiente de produção.

---

# Arquitetura Geral

A aplicação será dividida em três camadas principais.

```

```
┌────────────────────────────┐
│        Next.js             │
│         Frontend           │
└────────────┬───────────────┘
             │ REST API
             ▼
┌────────────────────────────┐
│          NestJS            │
│          Backend           │
└────────────┬───────────────┘
             │ Prisma ORM
             ▼
┌────────────────────────────┐
│       PostgreSQL           │
└────────────────────────────┘
```

---

# Arquitetura Física

```
Frontend

↓

Vercel

↓

HTTPS

↓

NestJS

↓

Render

↓

Prisma

↓

Supabase PostgreSQL

↓

Cloudinary
```

---

# Tecnologias

## Frontend

Framework

Next.js 15

Motivos

- Server Side Rendering
- SEO
- Performance
- Image Optimization
- App Router
- Escalabilidade

---

Linguagem

TypeScript

---

Estilização

Tailwind CSS v4

---

Componentes

shadcn/ui

---

Animações

Framer Motion

---

Elementos 3D

React Three Fiber

Drei

---

Formulários

React Hook Form

Zod

---

Consumo de API

Axios

TanStack Query

---

Gráficos

Recharts

---

Ícones

Lucide React

---

Tema

next-themes

---

# Backend

Framework

NestJS

Motivos

- Arquitetura modular
- Dependency Injection
- Escalabilidade
- Semelhante ao Spring Boot
- Excelente organização

---

ORM

Prisma

---

Banco

PostgreSQL

---

Autenticação

JWT

Refresh Token

---

Upload

Cloudinary

---

Documentação

Swagger

---

Validação

class-validator

class-transformer

---

Hash

bcrypt

---

Logs

Nest Logger

---

# Organização dos Repositórios

```
metrology-platform/

frontend/

backend/

docs/
```

Cada aplicação poderá ser implantada independentemente.

---

# Estrutura do Frontend

```
frontend/

src/

app/

components/

features/

hooks/

services/

providers/

contexts/

constants/

types/

lib/

utils/

styles/

assets/

public/
```

---

# Organização dos Components

```
components/

ui/

layout/

common/

forms/

tables/

charts/

feedback/

navigation/
```

---

# Organização das Features

```
features/

home/

services/

equipment/

contact/

institutional/

budget/

dashboard/

crm/

analytics/

settings/
```

Cada feature deve conter seus próprios:

- components
- hooks
- services
- types

Sempre que possível.

---

# Estrutura do Backend

```
backend/

src/

modules/

common/

config/

database/

prisma/
```

---

# Modules

```
modules/

auth/

users/

roles/

permissions/

services/

categories/

equipment/

partners/

certifications/

team/

testimonials/

faq/

budget/

crm/

notifications/

dashboard/

analytics/

upload/

cms/
```

Cada módulo será independente.

---

# Estrutura de um módulo

```
budget/

controllers/

services/

repositories/

dto/

entities/

interfaces/

types/

guards/

decorators/
```

---

# Comunicação

Frontend nunca acessa banco.

Frontend nunca acessa Prisma.

Toda comunicação acontece via REST.

```
React

↓

Axios

↓

Nest

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL
```

---

# Fluxo de Requisição

Cliente

↓

Controller

↓

Validation

↓

Service

↓

Repository

↓

Prisma

↓

Banco

↓

Resposta

---

# Princípios Arquiteturais

## SOLID

Aplicado em todo backend.

---

## Clean Architecture

Separação entre:

Controllers

Services

Repositories

Database

---

## Separation of Concerns

Cada módulo possui apenas uma responsabilidade.

---

## Feature Based Architecture

Frontend organizado por domínio.

---

## Atomic Design

Componentes reutilizáveis.

Atoms

Molecules

Organisms

Templates

Pages

---

# Gerenciamento de Estado

React Query

Para dados remotos.

---

React Hook Form

Para formulários.

---

Context API

Somente para:

Tema

Usuário autenticado

Sidebar

Idioma (caso exista)

Nunca utilizar Context para dados remotos.

---

# Autenticação

JWT

Fluxo

Login

↓

Access Token

↓

Refresh Token

↓

Revalidação automática

---

Papéis

ADMIN

COORDINATOR

TECHNICIAN

---

Permissões

RBAC

Cada rota protegida por Guards.

---

# Uploads

Arquivos aceitos

PDF

PNG

JPG

STEP

IGES

STL

ZIP

---

Fluxo

Cliente

↓

Upload

↓

Cloudinary

↓

Banco armazena URL

---

# Cache

Utilizar cache para:

Serviços

Equipamentos

Institucional

FAQ

Parceiros

---

# Tratamento de Erros

Backend

Global Exception Filter

Frontend

Error Boundary

Toast

Página de erro amigável

---

# Logs

Todos os erros importantes devem ser registrados.

Exemplos

Erro de autenticação

Erro de upload

Erro de banco

Erro interno

---

# Segurança

Helmet

CORS

Rate Limit

JWT

Hash de senha

Sanitização

Validação

Nunca confiar no frontend.

---

# SEO

Metadata dinâmica

robots.txt

sitemap.xml

Schema.org

Open Graph

Twitter Card

Canonical

---

# Performance

Code Splitting

Lazy Loading

Image Optimization

Dynamic Imports

Server Components

Streaming quando necessário

---

# Acessibilidade

WCAG AA

ARIA Labels

Focus Ring

Keyboard Navigation

Alt em imagens

Contraste

---

# Internacionalização

Arquitetura preparada para i18n.

Idiomas futuros:

Português

Inglês

Alemão

---

# Banco de Dados

Prisma ORM

Migrations versionadas

Seeds

Relacionamentos explícitos

UUID para entidades principais

Soft Delete quando necessário

---

# Versionamento da API

```
/api/v1/
```

Preparado para futuras versões.

---

# Convenções de Código

## Frontend

PascalCase

Componentes

camelCase

Hooks

SCREAMING_SNAKE_CASE

Constantes

---

## Backend

Controller

Service

Repository

DTO

Entity

Module

Sempre separados.

---

# Git

Branches

main

develop

feature/*

fix/*

release/*

---

Commits

Conventional Commits

Exemplos

feat:

fix:

refactor:

docs:

style:

test:

chore:

---

# Qualidade

ESLint

Prettier

Husky

lint-staged

EditorConfig

---

# Testes

Frontend

Vitest

React Testing Library

Playwright

---

Backend

Jest

Supertest

---

# CI/CD

GitHub Actions

Pipeline

Lint

↓

Testes

↓

Build

↓

Deploy

---

# Deploy

Frontend

Vercel

Backend

Render

Banco

Supabase PostgreSQL

Storage

Cloudinary

---

# Arquitetura Futura

A arquitetura foi projetada para permitir expansão sem necessidade de refatorações estruturais.

Possíveis evoluções:

- Aplicativo mobile (Flutter ou React Native)
- Integração com ERP
- Integração com CRM
- Portal do Cliente
- Assinatura eletrônica de propostas
- Geração automática de certificados
- Integração com Power BI
- Dashboard em tempo real
- IA para sugestão de custos e classificação de solicitações

---

# Architecture Decision Records (ADR)

## ADR-001 — Next.js

Escolhido devido ao excelente suporte a SEO, Server Components, otimização de imagens, App Router e alta performance para aplicações institucionais.

## ADR-002 — NestJS

Escolhido por sua arquitetura modular, uso extensivo de TypeScript, injeção de dependências nativa e organização semelhante ao Spring Boot.

## ADR-003 — Prisma

Escolhido pela produtividade, segurança de tipos, facilidade de migrações e excelente integração com TypeScript.

## ADR-004 — PostgreSQL

Escolhido pela robustez, confiabilidade, suporte a relacionamentos complexos e excelente desempenho para aplicações corporativas.

## ADR-005 — shadcn/ui

Escolhido por fornecer componentes acessíveis, altamente customizáveis e alinhados às melhores práticas do ecossistema React.

## ADR-006 — React Three Fiber

Escolhido para incorporar elementos tridimensionais interativos, reforçando a identidade tecnológica da plataforma sem comprometer a experiência do usuário.
