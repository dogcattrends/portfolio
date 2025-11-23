# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [0.1.0] - 2025-11-23

### Adicionado

#### Infraestrutura e Deploy
- Configuração completa de CI/CD com GitHub Actions
- Workflow `ci.yml` com lint, tests, e2e (Playwright), build e Lighthouse
- Workflow `preview.yml` para PRs com upload de relatórios Lighthouse
- Configuração Vercel (`vercel.json`) com variáveis de ambiente documentadas
- Documentação detalhada de setup em `docs/ENV_SETUP.md`
- Badges de CI e Deploy no README

#### Features Core
- **Supabase Integration**: Client e server-side com migrations
  - Schemas: `conversations`, `messages`, `items`, `inventory_movements`
  - RLS policies e functions SQL
  - Scripts de seed (`scripts/seed-inventory.ts`)
  
- **WhatsApp Business Inbox**
  - Webhook handler (`/api/whatsapp/route.ts`)
  - Interface de conversas e mensagens
  - Composer com suporte a mídia
  - Sistema de tags e handoff
  - OpenAPI spec em `openapi/whatsapp.yaml`
  
- **Sistema de Inventário**
  - CRUD de itens (`/inventory`, `/inventory/[id]`)
  - Timeline de movimentações
  - Relatório de low stock (`/reports/low-stock`)
  - Filtros e exportação
  
- **Cases de Portfolio**
  - MDX content system (`content/cases/`)
  - Gerador de metadata e OG images
  - Search explorer com Fuse.js
  - 3 cases completos: CRO Loja, WhatsApp Inbox, Inventário

#### Componentes UI
- **DataGrid** (`components/ui/data-grid.tsx`)
  - Sorting, filtering, pagination
  - Keyboard navigation (WCAG 2.1 AA)
  - Loading/error/empty states
  - i18n (pt/en)
  
- **Composer** (`components/ui/composer.tsx`)
  - Rich text input
  - Upload de arquivos
  - Templates e atalhos
  - Acessível (ARIA compliant)
  
- **Before/After** (`components/ui/before-after.tsx`)
  - Comparação de métricas
  - Animações com Framer Motion
  - Badges de variação
  
- **Callout** (`components/ui/callout.tsx`)
  - Tipos: info, warning, error, success
  - Ícones personalizados
  
- **Outros**: Button, Card, Dialog, Tooltip (shadcn/ui + Radix)

#### Sistema de Propostas
- Gerador automático (`lib/proposal-generator.ts`)
  - Parse de 5 formatos de métricas
  - Screenshots automáticos (Lighthouse, axe, WebPageTest)
  - Export MD/HTML
  - Hook React (`hooks/use-proposal-generator.ts`)
  - Viewer UI (`components/proposal-viewer.tsx`)
  - 360+ linhas de testes

#### Testing
- **270+ assertions** distribuídas em:
  - Unit tests (Vitest + Testing Library)
  - E2E tests (Playwright)
  - Accessibility tests (jest-axe)
  - Visual regression (Lighthouse CI)
  
- Cobertura:
  - DataGrid: sorting, filtering, keyboard nav, i18n
  - Composer: templates, upload, validation
  - Error handling e guards
  - Message factories (20-message conversations)
  - Proposal generator (parse, export, screenshots)

#### Documentação
- `docs/ACCESSIBILITY.md` - Checklist WCAG 2.1
- `docs/PERFORMANCE-METRICS.md` - Reprodução de métricas
- `docs/PROPOSAL-GENERATOR.md` - API e exemplos
- `docs/TESTING-SUMMARY.md` - Estratégia de testes
- `docs/ENV_SETUP.md` - Configuração de ambiente
- `COMPONENTS-README.md` - Catálogo de componentes
- Postman collection (`docs/postman/whatsapp-collection.json`)

#### DevOps
- Husky + lint-staged (Prettier + ESLint)
- Commitlint (Conventional Commits)
- GitHub templates (PR, Bug Report, Feature Request)
- TypeScript strict mode
- Lighthouse config (`.lighthouserc.js`)

### Tecnologias

- **Framework**: Next.js 14 (App Router), React 18
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (Postgres + RLS)
- **Testing**: Vitest, Playwright, jest-axe
- **CI/CD**: GitHub Actions, Vercel
- **Analytics**: Custom events system
- **Animation**: Framer Motion
- **Search**: Fuse.js
- **Validation**: Zod schemas

### Segurança

- RLS policies no Supabase
- Service Role Key isolado (server-only)
- Environment variables validation
- HTTPS enforced
- CORS configurado

### Performance

- Core Web Vitals otimizados (LCP < 2.5s, CLS < 0.1)
- Image optimization (Next.js Image)
- Code splitting automático
- Edge-ready functions
- Lighthouse Score > 90

### Links

- **Repositório**: https://github.com/dogcattrends/portfolio
- **Deploy**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dogcattrends/portfolio)

---

[0.1.0]: https://github.com/dogcattrends/portfolio/releases/tag/v0.1.0
