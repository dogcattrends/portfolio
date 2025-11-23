# CRO Loja – Resumo de Proposta (7 dias)

## Problema típico
- Checkout com fricções (formas de frete, parcelamento, confiança).
- Web Vitals fora do budget (LCP > 2.5s, CLS > 0.1).
- Experimentação lenta (sem feature flags/rollbacks).

## Abordagem (sprint única de 7 dias)
1. **Diagnóstico rápido** (dia 1): mapear jornadas mobile/desktop, medir baseline (GA/LH) e definir hipóteses.
2. **Design tokens + checkout** (dias 2-3): componentes críticos (resumo, CTA, frete) com estados e acessibilidade.
3. **Experimentos Edge** (dias 4-5): feature flags (A/B) para selo de confiança, reordenação de etapas e bundles dinâmicos.
4. **Teste + rollout** (dias 6-7): monitorar KPIs, rollback seguro, handoff com documentação.

## Entregáveis
- Checkout refatorado (componentes UI + estados).
- 3 experimentos A/B configurados (trust badge, reordenação, bundles).
- Dash rápido de KPIs (conversão, LCP, abandono).
- Guia de rollout/rollback e checklists de QA/A11Y.

## Limites
- Integrações de gateway/ERP fora do escopo (mantém existentes).
- Conteúdo/cópia fornecidos pelo cliente.
- Suporte pós-sprint não incluso (contratável à parte).

## Checklist de entrega
- [ ] KPI baseline documentado
- [ ] Componentes críticos com testes e a11y
- [ ] Flags criadas e documentadas
- [ ] Budget Web Vitals cumprido em staging
- [ ] Playbook de rollout/rollback entregue

## Riscos
- Latência de provedores externos impactar LCP.
- Equipe interna não aplicar flags corretamente (mitigado com guia).
- Fluxos de pagamento legados limitarem experimentos.

## Investimento (faixa)
- R$ 12k – 16k para a sprint de 7 dias (fixo, escopo acima).
