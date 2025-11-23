# Script de Gravação – 90s por Case

## 1. CRO Loja (Checkout Edge)
**Meta:** 90 segundos ressaltando hipóteses → experimentos → resultados.

1. **0-10s — Abertura**
   - Narração: “Bem-vindo ao laboratório CRO. Em 90 segundos, mostro como reduzi fricção no checkout da Studio Nébula.”
   - Tela: Mostrar `/cases/cro-loja`, destacar KPIs (+42% conversão).

2. **10-35s — Diagnóstico e Hipóteses**
   - Narração: “Mapeei 47 pontos com heatmaps, entrevistas e scorecard esforço x impacto.”
   - Tela: Scrolldown no case mostrando seção “Contexto” e Callout HEART + AARRR.

3. **35-55s — Experimentos Edge**
   - Narração: “O controle dos testes roda no middleware Edge. Flag ativa o selo de confiança e reordena etapas.”
   - Tela: Mostrar snippet do `<Code>` (feature flag) e acionar toggle A/B (simular F12 ou highlight).

4. **55-75s — Before/After**
   - Narração: “No after, resumo destacado, CTA com provas sociais e auto-fill em 2 passos.”
   - Tela: Mostrar componente `<BeforeAfter>` zoom-in.

5. **75-90s — Resultados**
   - Narração: “Resultado: +42% conversão mobile, LCP 1.7s e ticket médio +18%. Tudo documentado no design system.”
   - Tela: Focar nos KPIs finais e CTA para “Voltar aos cases”.

## 2. WhatsApp Inbox
**Meta:** Demonstrar inbox + tags + handoff + notificações.

1. **0-15s — Pano de Fundo**
   - Narração: “GrowthMinds recebe 1.200 mensagens/dia. Criamos inbox unificada com Supabase realtime.”
   - Tela: `/cases/whatsapp-inbox` hero + vídeo demo.

2. **15-35s — Webhook/API**
   - Narração: “Webhook `/api/whatsapp` normaliza text, image, template e grava em conversations/messages com RLS.”
   - Tela: Mostrar trecho do JSON no Postman collection e OpenAPI.

3. **35-60s — Inbox UI**
   - Narração: “No /inbox, filtros ordenam conversas não lidas, tags persistem e o botão Handoff atribui squads.”
   - Tela: Navegar página `/inbox`, selecionar conversa, editar tags, clicar Handoff (mostrar spinner).

4. **60-80s — Composer & Upload**
   - Narração: “Template aplicado em um clique, upload inline e envio registra timeline + toast com som (respeitando prefers-reduced-motion).”
   - Tela: Escolher template no composer, anexar arquivo fake, enviar -> mostrar toast e wave sonoro (com comentários).

5. **80-90s — Fecho**
   - Narração: “Relatórios CSV/Excel e scripts Postman/OpenAPI garantem auditoria LGPD e demos rápidas.”
   - Tela: Mostrar `/reports/low-stock` export button + link docs/postman.

## 3. Inventário Supabase Edge
**Meta:** Linha do tempo + filtros persistidos + seed.

1. **0-12s — Intro**
   - Narrador: “Inventário da Nordic Hardware precisava alertas <500ms. Aqui, Next + Supabase Edge resolvem.”
   - Tela: `/cases/inventario-supabase`.

2. **12-35s — Schema & Seed**
   - Narrador: “Migration cria enums, políticas RLS e view pública. `npm run seed:inventory` gera 200 itens e 500 movimentos.”
   - Tela: Exibir supabase/migrations + terminal rodando seed.

3. **35-60s — Página /inventory**
   - Narrador: “Filtros persistem via URL e a grid usa SWR + estados acessíveis (loading/error).”
   - Tela: Usar filtros (status/category/search) e mostrar counters reagindo.

4. **60-80s — Detalhe + Timeline**
   - Narrador: “Cada item abre timeline virtualizada. Movimentos exibem notas, mídia e responsáveis.”
   - Tela: Entrar em `/inventory/[id]`, scrollar timeline.

5. **80-90s — Relatório e Próximos Passos**
   - Narrador: “Relatório Low Stock exporta CSV/Excel nativo e alimenta dashboards. Próximo passo: analytics reais no /reports.”
   - Tela: `/reports/low-stock`, clicar Export CSV, mostrar download.
