# Inventário Supabase – Proposal

## Problema típico
- Estoque B2B com pooling lento (5 min) e divergências frequentes.
- Falta de alertas proativos por SKU/local.
- Múltiplas fontes de verdade (ERP + planilhas).

## Abordagem
1. **Schema + RLS**: enums de status, movements (in/out/repair), view pública agregada, policies de segurança.
2. **Edge ingest**: webhooks do WMS para Edge Functions publicarem em canais Realtime.
3. **Dashboard**: `/inventory` com filtros persistidos via URL, `/inventory/[id]` com timeline e `/reports/low-stock` exportando CSV/Excel nativo.
4. **Seed + observabilidade**: script TS para 200 itens/500 movimentos, logs estruturados e budgets de latência.

## Entregáveis
- Migrations Supabase + seeds.
- UI de inventário + timeline + relatório de low stock.
- Guia de deploy e checklists (QA/A11Y/Web Vitals).

## Checklist
- [ ] Migrations aplicadas e RLS ativas
- [ ] Ingestão em tempo real validada
- [ ] Relatórios exportáveis (CSV/Excel)
- [ ] Alertas de latência configurados

## Riscos
- Webhooks do WMS indisponíveis/instáveis.
- Limitações de rede em operações de edge.
- Sem integrações ERP legadas neste escopo (pode ser fase 2).

## Investimento (faixa)
- R$ 14k – 20k (implantação completa com painel e relatórios).
