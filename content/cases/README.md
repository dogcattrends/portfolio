# Case Studies - Estrutura e Uso

## 🎯 Visão Geral

Cases são a base para:
- Demonstração de expertise técnica
- **Geração automática de propostas comerciais** 🆕
- SEO (Open Graph cards via `/api/og/case/[slug]`)
- Filtros por tags e indústria

---

## 📊 Geração Automática de Propostas

### Como Funciona

O sistema extrai **KPIs e screenshots automaticamente** de `index.json` para gerar propostas técnicas completas.

#### Exemplo de Métrica no index.json

\`\`\`json
{
  "metrics": [
    {
      "label": { "pt": "Taxa de conversão", "en": "Conversion rate" },
      "value": "+42%"
    },
    {
      "label": { "pt": "LCP médio", "en": "Median LCP" },
      "value": "1.7s"
    },
    {
      "label": { "pt": "NPS da squad", "en": "Squad NPS" },
      "value": "62 → 84"
    }
  ]
}
\`\`\`

#### Parse Automático

O sistema detecta o formato e extrai:

| Formato | Exemplo | Parsing |
|---------|---------|---------|
| Melhoria | `+42%` | `before: 0, after: 42, improvement: "+42%"` |
| Redução | `-63%` | `before: 100, after: 37, improvement: "-63%"` (positivo para tempo/erros) |
| Absoluto | `1.7s` | `before: 0, after: 1.7, unit: "s"` |
| Range | `62 → 84` | `before: 62, after: 84, improvement: "+35.5%"` |
| Latência | `280ms` | `before: 0, after: 280, unit: "ms"` |

#### Screenshots Automáticos

Baseado no **label** da métrica:

- **Lighthouse**: `lcp`, `cls`, `fid`, `lighthouse` → placehold.co/1200x800 com tema azul
- **axe DevTools**: `a11y`, `wcag`, `violações` → placehold.co/1200x800 com tema verde
- **WebPageTest**: `payload`, `requests`, `3g` → placehold.co/1200x800 com tema roxo

#### Uso Programático

\`\`\`typescript
import { getCaseSummaries } from "@/lib/cases";
import { generateProposal } from "@/lib/proposal-generator";

const cases = await getCaseSummaries("pt");
const selected = cases.filter(c => c.tags.includes("CRO"));

const proposal = generateProposal(selected, "Acme Corp");
// {
//   client: "Acme Corp",
//   sections: [...],
//   metadata: { totalKpis: 5, totalScreenshots: 3, avgImprovement: "+32.5%" }
// }
\`\`\`

📖 **Documentação completa:** [docs/PROPOSAL-GENERATOR.md](../../docs/PROPOSAL-GENERATOR.md)

---

## Componente CaseKpi

### Uso básico
```tsx
import { CaseKpi } from "@/components/case-kpi";

<CaseKpi
  metrics={[
    {
      label: "Performance",
      value: 91,
      delta: 117,
      direction: "positive",
      tooltip: "Lighthouse score melhorou de 42 para 91",
      ariaDescription: "Aumento de 117% após otimizações"
    }
  ]}
/>
```

### Props
- `metrics`: Array de KPIs com valor, delta e direção
- `layout`: "grid" | "horizontal" | "vertical" (default: "grid")
- `className`: Classes CSS adicionais

### Acessibilidade
- `aria-label` automático com valor e variação
- `aria-description` para contexto adicional
- `data-testid` para testes
- Tooltips com Radix UI

## MDX Files

### Estrutura padrão

```markdown
---
title: "Título do Case"
client: "Cliente/Projeto"
date: "YYYY-MM"
tags: ["tag1", "tag2"]
featured: true/false
---

## Problema
Contexto do problema com métricas iniciais.

## Ação
Passos implementados com snippets de código.

## Evidência
Métricas before/after, screenshots (Lighthouse/axe).

## Riscos e Limites
Trade-offs e limitações técnicas/organizacionais.

## Próximos Passos
Roadmap de melhorias futuras.
```

## Cases Incluídos

1. **performance-optimization-spa.mdx**
   - Bundle: 850kb → 320kb (-62%)
   - Lighthouse: 42 → 91 (+117%)
   - LCP: 4.8s → 1.8s

2. **accessibility-dashboard-remediation.mdx**
   - axe violations: 319 → 15 (-95%)
   - WCAG AA: 100% compliance
   - SUS Score: 42 → 78

3. **graphql-migration-mobile-app.mdx**
   - Requests: 23 → 1
   - Payload: 4.7MB → 1.1MB (-77%)
   - Load time (3G): 8.2s → 2.4s
