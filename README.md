# Portfolio ++

## Visão
- Landing e CMS pessoal com foco em prospecção B2B e provas de engenharia.
- Inventário em tempo real + inbox integrado para simular operações reais (Supabase + Next.js).
- Pipeline de automação (WhatsApp webhook, scripts de seed, relatórios) documentado para facilitar demonstrações.

## Stack & Arquitetura
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript strict, shadcn/ui + Radix.
- **Design System:** Tailwind CSS + tokens utilitários (`cn`, variáveis CSS), animações com Framer Motion.
- **Dados:** Supabase (Postgres, RLS, functions) + scripts TS (`scripts/seed-inventory.ts`).
- **Testing & QA:** Vitest + Testing Library, Playwright, Lighthouse CI, axe-core/react, jest-axe nos componentes críticos.
- **DevOps:** Husky + lint-staged (Prettier + ESLint import/order), GitHub Actions (CI + Preview artefatos LHCI), Commitlint convencional.

## Como rodar localmente
```bash
cp .env.example .env        # configure Supabase + Meta WABA tokens
npm install                 # instala dependências (Node 20+)
npm run db:push             # aplica migrations Supabase
npm run seed:inventory      # popula 200 itens / 500 movimentos
npm run dev                 # http://localhost:3000
```
- `npm run test` ? testes unitários (Vitest)
- `npm run e2e` ? Playwright headless (instale browsers com `npx playwright install`)
- `npm run lh` ? Lighthouse CI (requer `npm run build` prévio)

## Provas e Evidências
| Tipo | Link |
| --- | --- |
| Demo (Vercel) | https://portfolio-demo.example.com |
| Lighthouse CI | [Workflow CI](https://github.com/byimp/portifolio/actions/workflows/ci.yml) (artefato `lhci-report`) |
| axe-core/react | [Checklist A11Y](docs/ACCESSIBILITY.md) |
| Vídeos | [Walkthrough (YouTube)](https://youtu.be/demo-portfolio) + [Stories](https://drive.example.com/stories) |
| Postman/OpenAPI | [`docs/postman/whatsapp-collection.json`](docs/postman/whatsapp-collection.json) / [`openapi/whatsapp.yaml`](openapi/whatsapp.yaml) |

## Casos em Destaque
1. **CRO Loja** – melhorias de checkout com experimentos Edge + KPIs rastreados.
2. **WhatsApp Inbox** – webhook + inbox com templates, handoff, tags e exportação de evidências.
3. **Inventário Supabase** – dashboards e relatórios (low stock, timeline, CSV/Excel nativo).

## Limites atuais
- Webhooks do WhatsApp exigem tokens reais (mockados localmente).
- Relatórios Lighthouse dependem do build estático; métricas em páginas dinamicamente carregadas podem variar.
- Áudio das notificações usa Web Audio API e pode ser bloqueado em alguns navegadores sem interação prévia.

## Roadmap (curto prazo)
- [ ] Enfileirar mensagens de outbound com worker e retries exponenciais.
- [ ] Implementar analytics reais em `/reports` consumindo `inventory_public_stats`.
- [ ] Adicionar autenticação (Clerk/Supabase Auth) para multi-tenant real.
- [ ] Gravar vídeo em 4K com os roteiros de `scripts/recording.md` e publicar em playlist.

## Licenças de Assets
- Ícones: Lucide (licença MIT).
- Fontes: Inter (SIL OFL 1.1 via Google Fonts).
- Ilustrações SVG (public/cases/*): autorais, uso livre com atribuição.
- Vídeos demonstrativos: placeholders do Coverr, licença CC0 com crédito opcional.
- Dados fake (seed, CSV) sob MIT para reuso.
