# Portfolio ++

[![CI](https://github.com/dogcattrends/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/dogcattrends/portfolio/actions/workflows/ci.yml)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dogcattrends/portfolio)

## Visão
- Landing e CMS pessoal com foco em prospec��o B2B e provas de engenharia.
- Invent�rio em tempo real + inbox integrado para simular opera��es reais (Supabase + Next.js).
- Pipeline de automa��o (WhatsApp webhook, scripts de seed, relat�rios) documentado para facilitar demonstra��es.

## Stack & Arquitetura
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript strict, shadcn/ui + Radix.
- **Design System:** Tailwind CSS + tokens utilit�rios (`cn`, vari�veis CSS), anima��es com Framer Motion.
- **Dados:** Supabase (Postgres, RLS, functions) + scripts TS (`scripts/seed-inventory.ts`).
- **Testing & QA:** Vitest + Testing Library, Playwright, Lighthouse CI, axe-core/react, jest-axe nos componentes cr�ticos.
- **DevOps:** Husky + lint-staged (Prettier + ESLint import/order), GitHub Actions (CI + Preview artefatos LHCI), Commitlint convencional.

## Como rodar localmente

### Pré-requisitos
- Node.js 20+
- npm ou pnpm
- Conta Supabase (ou Docker para instância local)

### Setup
```bash
# 1. Clone o repositório
git clone https://github.com/dogcattrends/portfolio.git
cd portfolio

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase
# Veja docs/ENV_SETUP.md para instruções detalhadas

# 4. Aplique migrations (se usando Supabase remoto)
npm run db:push

# 5. Popule dados de exemplo
npm run seed:inventory      # 200 itens + 500 movimentos
npm run dev                 # http://localhost:3000
```
- `npm run test` ? testes unit�rios (Vitest)
- `npm run e2e` ? Playwright headless (instale browsers com `npx playwright install`)
- `npm run lh` ? Lighthouse CI (requer `npm run build` pr�vio)

## Deploy

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dogcattrends/portfolio)

1. Click no botão acima
2. Configure as variáveis de ambiente (veja `docs/ENV_SETUP.md`)
3. Deploy automático a cada push na `main`

**Variáveis obrigatórias:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Alternativas
- **Docker:** `docker build -t portfolio . && docker run -p 3000:3000 portfolio`
- **Self-hosted:** `npm run build && npm start`

## Provas e Evidências
| Tipo | Link |
| --- | --- |
| Repositório | https://github.com/dogcattrends/portfolio |
| Lighthouse CI | [Workflow CI](https://github.com/dogcattrends/portfolio/actions/workflows/ci.yml) (artefato `lhci-report`) |
| axe-core/react | [Checklist A11Y](docs/ACCESSIBILITY.md) |
| V�deos | [Walkthrough (YouTube)](https://youtu.be/demo-portfolio) + [Stories](https://drive.example.com/stories) |
| Postman/OpenAPI | [`docs/postman/whatsapp-collection.json`](docs/postman/whatsapp-collection.json) / [`openapi/whatsapp.yaml`](openapi/whatsapp.yaml) |

## Casos em Destaque
1. **CRO Loja** � melhorias de checkout com experimentos Edge + KPIs rastreados.
2. **WhatsApp Inbox** � webhook + inbox com templates, handoff, tags e exporta��o de evid�ncias.
3. **Invent�rio Supabase** � dashboards e relat�rios (low stock, timeline, CSV/Excel nativo).

## Limites atuais
- Webhooks do WhatsApp exigem tokens reais (mockados localmente).
- Relat�rios Lighthouse dependem do build est�tico; m�tricas em p�ginas dinamicamente carregadas podem variar.
- �udio das notifica��es usa Web Audio API e pode ser bloqueado em alguns navegadores sem intera��o pr�via.

## Documentação

- [ENV_SETUP.md](docs/ENV_SETUP.md) - Configuração de variáveis de ambiente
- [ACCESSIBILITY.md](docs/ACCESSIBILITY.md) - Checklist de acessibilidade
- [PERFORMANCE-METRICS.md](docs/PERFORMANCE-METRICS.md) - Métricas e reprodução
- [PROPOSAL-GENERATOR.md](docs/PROPOSAL-GENERATOR.md) - Gerador automático de propostas
- [TESTING-SUMMARY.md](docs/TESTING-SUMMARY.md) - Estratégia de testes

## Roadmap (curto prazo)
- [ ] Enfileirar mensagens de outbound com worker e retries exponenciais.
- [ ] Implementar analytics reais em `/reports` consumindo `inventory_public_stats`.
- [ ] Adicionar autenticação (Clerk/Supabase Auth) para multi-tenant real.
- [ ] Gravar vídeo em 4K com os roteiros de `scripts/recording.md` e publicar em playlist.

## Licen�as de Assets
- �cones: Lucide (licen�a MIT).
- Fontes: Inter (SIL OFL 1.1 via Google Fonts).
- Ilustra��es SVG (public/cases/*): autorais, uso livre com atribui��o.
- V�deos demonstrativos: placeholders do Coverr, licen�a CC0 com cr�dito opcional.
- Dados fake (seed, CSV) sob MIT para reuso.
