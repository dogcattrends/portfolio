# Sistema de Geração Automática de Propostas

## 📄 Visão Geral

Sistema que **extrai KPIs e screenshots automaticamente dos cases** do portfólio e gera propostas técnicas completas com evidências mensuráveis.

### Funcionalidades

✅ **Extração Automática de KPIs**
- Parse inteligente de métricas do `content/cases/index.json`
- Suporte a formatos: `+42%`, `-63%`, `1.7s`, `62 → 84`, `280ms`
- Detecção automática de direção (positivo/negativo)
- Identificação de métricas onde "menor é melhor" (tempo, latência, erros)

✅ **Geração de Screenshots**
- Lighthouse para Core Web Vitals (LCP, CLS, FID)
- axe DevTools para acessibilidade (WCAG, violações)
- WebPageTest para rede (payload, requests, 3G)
- Placeholders com placehold.co
- Metadata (tool, timestamp, caption)

✅ **Exportação Multi-formato**
- **Markdown**: Para documentação técnica
- **HTML**: Para envio por email (CSS inline)
- **Clipboard**: Cópia rápida
- **Download**: `.md` ou `.html`

---

## 🚀 Uso Rápido

### 1. Gerar Proposta Programaticamente

\`\`\`typescript
import { getCaseSummaries } from "@/lib/cases";
import { generateProposal } from "@/lib/proposal-generator";

// Carregar cases
const cases = await getCaseSummaries("pt");

// Selecionar cases relevantes (ex: CRO + WhatsApp)
const selected = cases.filter((c) => 
  ["cro-loja", "whatsapp-inbox"].includes(c.slug)
);

// Gerar proposta
const proposal = generateProposal(
  selected,
  "Acme Corp",
  "Proposta para transformação digital do e-commerce"
);

console.log(proposal.metadata);
// {
//   totalCases: 2,
//   totalKpis: 5,
//   totalScreenshots: 3,
//   avgImprovement: "+32.5%"
// }
\`\`\`

### 2. Usar Componente Visual

\`\`\`tsx
import { ProposalViewer } from "@/components/proposal-viewer";
import { useProposalGenerator } from "@/hooks/use-proposal-generator";

export function MyProposalPage() {
  const { proposal, generate, isGenerating } = useProposalGenerator();

  return (
    <div>
      <button onClick={() => generate(cases, "Cliente X")}>
        Gerar Proposta
      </button>
      
      {proposal && <ProposalViewer proposal={proposal} showActions />}
    </div>
  );
}
\`\`\`

### 3. Exportar Formatos

\`\`\`typescript
import { 
  formatProposalAsMarkdown, 
  formatProposalAsHtml 
} from "@/lib/proposal-generator";

// Markdown
const markdown = formatProposalAsMarkdown(proposal);
await navigator.clipboard.writeText(markdown);

// HTML para email
const html = formatProposalAsHtml(proposal);
// Incluir em email marketing ou anexar
\`\`\`

---

## 📊 Estrutura de Dados

### ProposalKpi

\`\`\`typescript
interface ProposalKpi {
  label: string;              // "Taxa de conversão"
  valueBefore: string | number; // 0 ou valor numérico
  valueAfter: string | number;  // 42 ou "Ativo"
  improvement: string;         // "+42%" ou "N/A"
  direction: "positive" | "negative" | "neutral";
  unit?: string;              // "%", "s", "ms"
  screenshot?: string;        // URL do print
}
\`\`\`

### TechnicalScreenshot

\`\`\`typescript
interface TechnicalScreenshot {
  url: string;                // placehold.co ou imagem real
  alt: string;                // Descrição para acessibilidade
  caption: string;            // "Resultado do Lighthouse..."
  tool: "Lighthouse" | "axe DevTools" | "WebPageTest" | "Playwright" | "Custom";
  timestamp?: string;         // ISO 8601
}
\`\`\`

### GeneratedProposal

\`\`\`typescript
interface GeneratedProposal {
  client: string;             // "Acme Corp"
  date: string;               // "2025-11-19"
  caseReferences: string[];   // ["cro-loja", "whatsapp-inbox"]
  executiveSummary: string;
  sections: ProposalSection[];
  metadata: {
    totalCases: number;
    totalKpis: number;
    totalScreenshots: number;
    avgImprovement: string;   // "+32.5%"
  };
}
\`\`\`

---

## 🎯 Exemplos de Parse

### Melhoria Percentual com Sinal
\`\`\`typescript
parseCaseMetric("Taxa de conversão", "+42%");
// {
//   valueBefore: 0,
//   valueAfter: 42,
//   improvement: "+42%",
//   direction: "positive",
//   unit: "%"
// }
\`\`\`

### Redução (Menor é Melhor)
\`\`\`typescript
parseCaseMetric("Tempo de resposta", "-63%");
// {
//   valueBefore: 100,
//   valueAfter: 37,
//   improvement: "-63%",
//   direction: "positive", // menos tempo é positivo
//   unit: "%"
// }
\`\`\`

### Range com Seta
\`\`\`typescript
parseCaseMetric("NPS da squad", "62 → 84");
// {
//   valueBefore: 62,
//   valueAfter: 84,
//   improvement: "+35.5%",
//   direction: "positive"
// }
\`\`\`

### Valor Absoluto de Tempo
\`\`\`typescript
parseCaseMetric("LCP médio", "1.7s");
// {
//   valueBefore: 0,
//   valueAfter: 1.7,
//   improvement: "N/A",
//   unit: "s"
// }
\`\`\`

---

## 🖼️ Screenshots Automáticos

### Lighthouse (Core Web Vitals)
Gerado para KPIs com:
- `lcp`, `cls`, `fid` no label
- Valores em segundos (ex: `1.7s`)

\`\`\`typescript
{
  url: "https://placehold.co/1200x800/1e293b/cbd5e1?text=Lighthouse+Report%0ALCP%3A+1.7s",
  alt: "Lighthouse report mostrando LCP: 1.7s",
  caption: "Resultado do Lighthouse após otimizações: -43.75%",
  tool: "Lighthouse"
}
\`\`\`

### axe DevTools (Acessibilidade)
Gerado para KPIs com:
- `a11y`, `wcag`, `violações` no label

\`\`\`typescript
{
  url: "https://placehold.co/1200x800/059669/ffffff?text=axe+DevTools%0AViolações%3A+0",
  alt: "axe DevTools mostrando Violações: 0",
  caption: "Análise de acessibilidade: -100%",
  tool: "axe DevTools"
}
\`\`\`

### WebPageTest (Performance de Rede)
Gerado para KPIs com:
- `payload`, `requests`, `3g` no label

\`\`\`typescript
{
  url: "https://placehold.co/1200x800/7c3aed/ffffff?text=WebPageTest%0APayload%3A+1.1MB",
  alt: "WebPageTest mostrando Payload: 1.1MB",
  caption: "Teste de performance em condições reais: -77%",
  tool: "WebPageTest"
}
\`\`\`

---

## 📝 Formatos de Exportação

### Markdown
- Headers com `#`, `##`, `###`
- Tabelas com pipes `|`
- Imagens com `![alt](url)`
- Ideal para: GitHub, Notion, Confluence

**Exemplo:**
\`\`\`markdown
# Proposta Técnica - Acme Corp

**Data:** 19/11/2025

---

## Resumo Executivo

Com base em 2 projeto(s) similar(es)...

### Métricas Agregadas

- **Cases de Referência:** 2
- **KPIs Mensurados:** 5
- **Evidências Técnicas:** 3 screenshots
- **Melhoria Média:** +32.5%

---

## 1. Experiência com Studio Nébula - E-commerce

### KPIs Alcançados

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Taxa de conversão | N/A | 42% | **+42%** |
| Ticket médio | N/A | 18% | **+18%** |

### Evidências Técnicas

1. **Lighthouse:** Resultado após otimizações: -43.75%
   ![Lighthouse report](https://placehold.co/...)
\`\`\`

### HTML
- CSS inline para emails
- Tabelas semânticas
- Imagens com `loading="lazy"`
- Ideal para: Email marketing, PDFs

**Exemplo:**
\`\`\`html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <style>
    body { font-family: system-ui; line-height: 1.6; color: #1e293b; }
    .positive { color: #16a34a; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f1f5f9; }
  </style>
</head>
<body>
  <h1>Proposta Técnica - Acme Corp</h1>
  <table>
    <thead>
      <tr><th>Métrica</th><th>Melhoria</th></tr>
    </thead>
    <tbody>
      <tr><td>Taxa de conversão</td><td class="positive">+42%</td></tr>
    </tbody>
  </table>
</body>
</html>
\`\`\`

---

## 🧪 Testes

### Executar Testes

\`\`\`bash
npm test -- proposal-generator.test.ts
\`\`\`

### Cobertura

\`\`\`typescript
describe("Proposal Generator", () => {
  describe("parseCaseMetric", () => {
    it("deve parsear melhoria percentual com sinal positivo");
    it("deve parsear redução percentual com sinal negativo");
    it("deve parsear valor de tempo (LCP)");
    it("deve parsear range com seta (NPS)");
    it("deve parsear latência em milissegundos");
    it("deve identificar métrica onde menor é melhor (tempo)");
  });

  describe("generateScreenshotsForKpis", () => {
    it("deve gerar screenshot de Lighthouse para LCP");
    it("deve gerar screenshot de axe DevTools para acessibilidade");
    it("deve gerar screenshot de WebPageTest para payload");
    it("deve gerar múltiplos screenshots para múltiplos KPIs");
  });

  describe("generateProposal", () => {
    it("deve gerar proposta com múltiplos cases");
    it("deve incluir KPIs parseados em cada seção");
    it("deve gerar screenshots para KPIs relevantes");
    it("deve calcular melhoria média");
  });

  describe("formatProposalAsMarkdown", () => {
    it("deve formatar proposta em Markdown");
    it("deve incluir tabela de KPIs");
  });

  describe("formatProposalAsHtml", () => {
    it("deve formatar proposta em HTML válido");
    it("deve incluir estilos CSS inline");
  });
});
\`\`\`

**Total:** 30+ testes, cobrindo parse, screenshots, geração e formatação.

---

## 🎨 UI Components

### ProposalViewer

\`\`\`tsx
<ProposalViewer 
  proposal={proposal}
  showActions={true}
  onCopy={(format) => console.log(\`Copiado: \${format}\`)}
  onDownload={(format) => console.log(\`Baixado: \${format}\`)}
/>
\`\`\`

**Features:**
- Header com cliente e data
- Resumo executivo com métricas agregadas (grid 2x4)
- Seções com KPIs (componente `CaseKpi` + tabela)
- Screenshots em grid 2-col
- Botões de ação: Copy Markdown, Copy HTML, Download .md, Download .html
- Toast de confirmação (2s)

### useProposalGenerator Hook

\`\`\`tsx
const { proposal, isGenerating, error, generate, reset } = useProposalGenerator();

await generate(cases, "Cliente X", "Contexto adicional");
// proposal: GeneratedProposal | null
// isGenerating: boolean
// error: string | null
\`\`\`

---

## 🔗 Integração com Composer

Template `/proposta` atualizado:

\`\`\`typescript
{
  command: "proposta",
  label: "Proposta Técnica",
  description: "Gerar proposta a partir de cases",
  content:
    "📄 **Proposta Técnica Automatizada**\\n\\n" +
    "Olá! Vou elaborar uma proposta baseada nos meus cases de sucesso.\\n\\n" +
    "Para personalizar, informe:\\n" +
    "1. Nome da empresa\\n" +
    "2. Tipo de projeto (performance, acessibilidade, migração)\\n" +
    "3. Principais desafios\\n\\n" +
    "💡 A proposta incluirá:\\n" +
    "• KPIs de projetos similares\\n" +
    "• Screenshots de evidências técnicas (Lighthouse, axe)\\n" +
    "• Métricas antes/depois\\n" +
    "• Timeline estimada",
  category: "comercial",
}
\`\`\`

---

## 📁 Arquitetura de Arquivos

\`\`\`
lib/
├── proposal-generator.ts          # Core: parse, generate, format
├── cases.ts                       # Loader de cases do index.json

hooks/
└── use-proposal-generator.ts      # Hook React com estado

components/
└── proposal-viewer.tsx            # UI de visualização e export

app/examples/proposal-generator/
└── page.tsx                       # Página demo interativa

__tests__/lib/
└── proposal-generator.test.ts     # 30+ testes

content/cases/
└── index.json                     # Source de KPIs
    {
      "metrics": [
        { "label": { "pt": "..." }, "value": "+42%" }
      ]
    }
\`\`\`

---

## 🚦 Roadmap

### ✅ Implementado
- [x] Parse automático de 5 formatos de métricas
- [x] Geração de screenshots para 3 tools (Lighthouse, axe, WPT)
- [x] Export Markdown e HTML
- [x] Componente visual com ações
- [x] Hook customizado
- [x] 30+ testes
- [x] Integração com Composer

### 🔜 Próximos Passos
- [ ] Upload de screenshots reais (via Cloudinary/S3)
- [ ] PDF generation com Puppeteer
- [ ] Templates customizáveis
- [ ] Assinatura digital
- [ ] Versionamento de propostas
- [ ] API endpoint REST para geração
- [ ] Webhook para notificações
- [ ] Analytics (propostas geradas, conversão)

---

## 💡 Casos de Uso

1. **Proposta para Lead Qualificado**
   - Selecionar 2-3 cases do mesmo segmento
   - Adicionar contexto específico do cliente
   - Exportar HTML e enviar por email

2. **Apresentação Comercial**
   - Gerar proposta com todos os cases
   - Baixar Markdown
   - Importar no Notion/Confluence
   - Compartilhar link

3. **Resposta Rápida no WhatsApp**
   - Usar comando `/proposta` no Composer
   - Copiar Markdown
   - Colar no chat
   - Screenshots inline

4. **Portfólio Público**
   - Página `/examples/proposal-generator`
   - Formulário com seleção de cases
   - Preview em tempo real
   - Download direto

---

## 🤝 Contribuindo

Para adicionar novo formato de métrica:

\`\`\`typescript
// lib/proposal-generator.ts
const METRIC_PARSERS: Record<string, Parser> = {
  // ...parsers existentes,
  
  // Novo: Range com hífen
  hyphenRange: (value) => {
    const match = value.match(/(\\d+)-(\\d+)/);
    if (!match || !match[1] || !match[2]) return { before: 0, after: value };
    return { before: parseFloat(match[1]), after: parseFloat(match[2]) };
  },
};
\`\`\`

Adicionar teste:

\`\`\`typescript
it("deve parsear range com hífen", () => {
  const kpi = parseCaseMetric("Range", "10-20");
  expect(kpi.valueBefore).toBe(10);
  expect(kpi.valueAfter).toBe(20);
});
\`\`\`

---

## 📚 Referências

- [content/cases/index.json](../content/cases/index.json) - Source de métricas
- [lib/cases.ts](../lib/cases.ts) - Loader de cases
- [components/case-kpi.tsx](../components/case-kpi.tsx) - Componente de KPIs
- [PERFORMANCE-METRICS.md](./PERFORMANCE-METRICS.md) - Guia de reprodução
