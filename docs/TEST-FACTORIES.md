# Test Factories & Datasets

Documentação completa dos enums TypeScript, schemas Zod e factories de seed com datasets realistas para testes.

## 📋 Estrutura

```
types/
  enums.ts              # Enums do domínio (15 enums)
lib/
  schemas.ts            # Schemas Zod com validação (11 schemas)
  test-factories.ts     # Factories e datasets (10 itens c/ estados extremos)
__tests__/
  test-factories.test.ts # 140+ testes de validação
```

## 🏗️ Enums TypeScript

### Enums Principais

```typescript
// Status e Estados
ProjectStatus: DRAFT | IN_PROGRESS | COMPLETED | ARCHIVED
PublicationStatus: DRAFT | REVIEW | PUBLISHED | ARCHIVED
ContactStatus: NEW | IN_PROGRESS | RESPONDED | CLOSED

// Habilidades e Níveis
SkillCategory: FRONTEND | BACKEND | DEVOPS | DESIGN | TOOLS | SOFT_SKILLS
ProficiencyLevel: 1 (Beginner) → 5 (Master)

// Métricas
MetricType: PERFORMANCE | ACCESSIBILITY | SEO | BEST_PRACTICES | PWA
DeltaDirection: POSITIVE | NEGATIVE | NEUTRAL

// Negócio
CaseStudyType: PERFORMANCE_OPTIMIZATION | ACCESSIBILITY_IMPROVEMENT | 
               ARCHITECTURE_REDESIGN | MIGRATION | FEATURE_DEVELOPMENT
MarketSegment: FINTECH | HEALTHTECH | EDTECH | ECOMMERCE | SAAS | etc.

// Geografia (Cidades Brasileiras)
Location: SAO_PAULO_SP | RIO_DE_JANEIRO_RJ | BELO_HORIZONTE_MG | 
          CURITIBA_PR | FLORIANOPOLIS_SC | REMOTE | INTERNATIONAL
```

### Helper de Labels

```typescript
import { EnumLabels, ProjectStatus } from "@/types/enums";

// Tradução para UI
const label = EnumLabels.ProjectStatus[ProjectStatus.IN_PROGRESS]; 
// → "Em Progresso"
```

## 📐 Schemas Zod

### Project Schema

```typescript
const project = ProjectSchema.parse({
  title: "E-commerce Headless",
  slug: "ecommerce-headless",
  description: "Plataforma com CMS customizado",
  status: ProjectStatus.COMPLETED,
  tags: ["ecommerce", "headless"],
  technologies: ["Next.js", "TypeScript"],
  startDate: new Date("2023-01-15"),
  metrics: {
    linesOfCode: 78000,
    contributors: 12,
    commits: 3400,
  },
});
```

**Validações:**
- `title`: 1-200 chars
- `slug`: kebab-case regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
- `description`: 10-500 chars
- `tags`: 1-10 items
- `technologies`: min 1 item
- URLs: formato válido com `.url()`

### Skill Schema

```typescript
const skill = SkillSchema.parse({
  name: "TypeScript",
  category: SkillCategory.FRONTEND,
  level: ProficiencyLevel.ADVANCED, // 3
  yearsOfExperience: 5,
  description: "Linguagem tipada para JavaScript",
});
```

**Validações:**
- `yearsOfExperience`: 0-50 anos
- `description`: max 300 chars

### CaseStudy Schema

```typescript
const caseStudy = CaseStudySchema.parse({
  title: "Otimização de Performance SPA",
  client: "Nubank",
  industry: MarketSegment.FINTECH,
  location: Location.SAO_PAULO_SP,
  summary: "Redução de 67% no tempo de carregamento",
  problem: "FCP de 4.2s causava 34% de abandono",
  solution: "Code splitting granular e lazy loading",
  results: "FCP para 1.4s, +28% conversão",
  technologies: ["React", "Webpack"],
  teamSize: 4,
  duration: { value: 3, unit: "months" },
  metrics: [/* PerformanceMetric[] */],
});
```

**Validações:**
- `summary`: 50-500 chars
- `problem`, `solution`, `results`: min 100 chars
- `teamSize`: 1-100 pessoas
- `duration.unit`: "days" | "weeks" | "months" | "years"

### ContactForm Schema

```typescript
const form = ContactFormSchema.parse({
  name: "Maria Silva",
  email: "maria@example.com",
  subject: "Proposta de colaboração",
  message: "Gostaria de conversar sobre projeto React...",
  type: ContactType.COLLABORATION,
  phone: "+5511987654321", // opcional, formato E.164
});
```

**Validações:**
- `name`: 2-100 chars
- `email`: formato válido
- `subject`: 5-200 chars
- `message`: 20-2000 chars
- `phone`: regex `/^\+?[1-9]\d{1,14}$/` (E.164)

## 🏭 Factories de Seed

### Uso Básico

```typescript
import { createProject, createSkill, testDatasets } from "@/lib/test-factories";

// Criar entidade com defaults
const project = createProject();

// Override de campos específicos
const draftProject = createProject({
  status: ProjectStatus.DRAFT,
  metrics: { linesOfCode: 0, contributors: 0, commits: 0 },
});

// Usar datasets prontos (10 itens cada)
const allProjects = testDatasets.projects;
const firstThree = generateTestDataset("projects", 3);
```

### Datasets com Estados Extremos

#### Projects (10 itens)

```typescript
testDatasets.projects[0] // Novo, zero métricas
testDatasets.projects[1] // Arquivado, 250k LOC, 25 devs, 8500 commits
testDatasets.projects[2] // Em progresso, featured
testDatasets.projects[4] // Sem URLs (interno)
testDatasets.projects[8] // Data futura (edge case)
testDatasets.projects[9] // 1 dia de duração
```

**Estados cobertos:**
- ✅ Zero: commits, contributors, LOC = 0
- ✅ Alto volume: 250k LOC, 25 devs, 8500 commits, 15 screenshots
- ✅ Temporal: data futura, projeto de 1 dia
- ✅ Ausência: sem URLs, sem métricas, tag única

#### Skills (10 itens)

```typescript
testDatasets.skills[0] // Beginner, 0 anos (Rust)
testDatasets.skills[1] // Master, 15 anos (JavaScript)
testDatasets.skills[8] // Sem descrição
testDatasets.skills[9] // Sem ícone
```

**Estados cobertos:**
- ✅ Níveis: 1 (Beginner) → 5 (Master)
- ✅ Experiência: 0 anos → 15 anos
- ✅ Categorias: todas 6 categorias (FRONTEND, BACKEND, DEVOPS, DESIGN, TOOLS, SOFT_SKILLS)

#### Performance Metrics (10 itens)

```typescript
testDatasets.performanceMetrics[0] // 0 → 100 (melhoria extrema)
testDatasets.performanceMetrics[1] // 100 → 0 (piora extrema)
testDatasets.performanceMetrics[2] // 75 → 75 (sem mudança, delta 0)
testDatasets.performanceMetrics[9] // 0 → 85 (PWA sem implementação)
```

**Estados cobertos:**
- ✅ Delta: -100 (piora total), 0 (neutro), +165 (melhoria 165%)
- ✅ Valores extremos: 0, 100
- ✅ Todos tipos: PERFORMANCE, ACCESSIBILITY, SEO, BEST_PRACTICES, PWA

#### Case Studies (10 itens)

```typescript
testDatasets.caseStudies[0] // Nubank, 1 pessoa, 2 semanas
testDatasets.caseStudies[1] // iFood, 25 pessoas, 2 anos
testDatasets.caseStudies[9] // Magazine Luiza, 1 dia (Black Friday hotfix)
```

**Empresas reais:**
- Nubank, iFood, Stone Pagamentos, QuintoAndar, MercadoLivre
- Ministério da Economia (Gov), Stripe (Internacional)
- Hospital Albert Einstein, Magazine Luiza

**Estados cobertos:**
- ✅ Equipe: 1 pessoa → 25 pessoas
- ✅ Duração: 1 dia → 2 anos
- ✅ Localizações: 10 cidades brasileiras + Remoto + Internacional
- ✅ Segmentos: todos 10 segmentos (FINTECH, HEALTHTECH, etc.)

#### KPI Metrics (10 itens)

```typescript
testDatasets.kpiMetrics[0] // Delta 0, neutro
testDatasets.kpiMetrics[1] // Delta -104% (bundle size cresceu)
testDatasets.kpiMetrics[2] // Delta +165% (conversão aumentou)
testDatasets.kpiMetrics[3] // Valor string "100% Acessível"
testDatasets.kpiMetrics[6] // R$ 2.500.000 (valor alto)
```

**Estados cobertos:**
- ✅ Delta: 0, -104%, +165%, 1.4% (pequeno)
- ✅ Valores: string, número baixo, milhões
- ✅ Sem previous value / sem tooltip

#### Tags (10 itens)

```typescript
testDatasets.tags[0] // Count 0 (não usado)
testDatasets.tags[4] // Count 28 (muito usado)
```

#### Experiences (10 itens)

```typescript
testDatasets.experiences[0] // Atual (current: true, sem endDate)
testDatasets.experiences[1] // 2 meses (startup falida)
testDatasets.experiences[2] // 5 anos (Stone)
testDatasets.experiences[3] // Freelance remoto
testDatasets.experiences[8] // Internacional (Google US)
```

**Estados cobertos:**
- ✅ Duração: 2 meses → 5 anos
- ✅ Tipos: full_time, part_time, contract, freelance
- ✅ Conquistas: 1 → 5+ achievements

#### Contacts (10 itens)

```typescript
testDatasets.contacts[0] // HIRING, respondido
testDatasets.contacts[3] // INQUIRY, novo
testDatasets.contacts[9] // Criado há 30 dias, fechado
```

**Estados cobertos:**
- ✅ Status: NEW, IN_PROGRESS, RESPONDED, CLOSED
- ✅ Tipos: todos 5 tipos (INQUIRY, COLLABORATION, HIRING, FEEDBACK, OTHER)
- ✅ Mensagens: 20 chars (mínima) → 2000 chars (longa)

## 🧪 Testes

### Executar Testes

```bash
npm test -- test-factories.test.ts
```

### Estrutura dos Testes (140+ asserções)

```typescript
describe("Test Factories - Datasets", () => {
  describe("Projects Dataset", () => {
    it("deve conter 10 projetos");
    it("deve incluir projeto com métricas zero");
    it("deve incluir projeto com alto volume de código");
    it("todos projetos devem ter slug válido");
    // ... 8 testes
  });

  describe("Skills Dataset", () => {
    it("deve incluir skill de nível BEGINNER com 0 anos");
    it("deve incluir skill de nível MASTER com 15+ anos");
    it("deve cobrir todas categorias");
    // ... 6 testes
  });

  describe("Performance Metrics Dataset", () => {
    it("deve incluir métrica com delta zero");
    it("deve incluir métrica com melhoria extrema (0 → 100)");
    it("todos valores devem estar entre 0 e 100");
    // ... 6 testes
  });

  // ... +7 grupos de testes
  
  describe("Edge Cases - Estados Extremos", () => {
    it("deve ter projeto com data futura");
    it("deve ter métrica com ambos extremos (0 e 100)");
    it("deve ter case study com duração de 1 dia");
    // ... 6 testes
  });
});
```

## 📊 Uso em Componentes

### CaseKpi Component

```tsx
import { testDatasets } from "@/lib/test-factories";

export default function CaseKpiDemo() {
  const metrics = testDatasets.kpiMetrics.slice(0, 4);
  
  return <CaseKpi metrics={metrics} />;
}
```

### Storybook Stories

```tsx
import { createProject, generateTestDataset } from "@/lib/test-factories";

export const Default = {
  args: {
    project: createProject(),
  },
};

export const WithHighMetrics = {
  args: {
    project: createProject({
      metrics: { linesOfCode: 250000, contributors: 25, commits: 8500 },
    }),
  },
};

export const AllProjects = {
  args: {
    projects: generateTestDataset("projects"),
  },
};
```

### Testes de Integração

```tsx
import { testDatasets } from "@/lib/test-factories";
import { render, screen } from "@testing-library/react";

describe("ProjectList", () => {
  it("deve renderizar todos projetos do dataset", () => {
    render(<ProjectList projects={testDatasets.projects} />);
    
    expect(screen.getAllByRole("article")).toHaveLength(10);
  });

  it("deve exibir métricas zero corretamente", () => {
    const zeroProject = testDatasets.projects.find(
      p => p.metrics?.commits === 0
    );
    
    render(<ProjectCard project={zeroProject} />);
    expect(screen.getByText("0 commits")).toBeInTheDocument();
  });
});
```

## 🎯 Casos de Uso

### 1. Seed de Banco de Dados

```typescript
import { testDatasets } from "@/lib/test-factories";
import { prisma } from "@/lib/prisma";

async function seed() {
  // Criar projetos
  for (const project of testDatasets.projects) {
    await prisma.project.create({ data: project });
  }
  
  // Criar skills
  for (const skill of testDatasets.skills) {
    await prisma.skill.create({ data: skill });
  }
  
  console.log("✅ Database seeded com 10 itens por entidade");
}
```

### 2. Testes de Performance

```typescript
import { generateTestDataset } from "@/lib/test-factories";

describe("Performance", () => {
  it("deve renderizar 100 projetos em < 100ms", () => {
    // Gerar 100 projetos duplicando dataset
    const projects = Array.from({ length: 10 }, () => 
      generateTestDataset("projects")
    ).flat();
    
    const start = performance.now();
    render(<ProjectGrid projects={projects} />);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(100);
  });
});
```

### 3. Validação de Schemas

```typescript
import { ProjectSchema } from "@/lib/schemas";
import { testDatasets } from "@/lib/test-factories";

describe("Schema Validation", () => {
  it("todos projetos do dataset devem passar validação Zod", () => {
    testDatasets.projects.forEach(project => {
      expect(() => ProjectSchema.parse(project)).not.toThrow();
    });
  });
});
```

### 4. Componentes de UI (Showcase)

```tsx
// app/showcase/page.tsx
import { testDatasets } from "@/lib/test-factories";

export default function ShowcasePage() {
  return (
    <div>
      <h2>Estados Extremos - Projects</h2>
      
      <h3>Zero Métricas</h3>
      <ProjectCard project={testDatasets.projects[0]} />
      
      <h3>Alto Volume</h3>
      <ProjectCard project={testDatasets.projects[1]} />
      
      <h3>Sem URLs</h3>
      <ProjectCard project={testDatasets.projects[4]} />
    </div>
  );
}
```

## 🔍 Convenções

### Naming

- **Enums**: PascalCase (`ProjectStatus`, `SkillCategory`)
- **Schemas**: PascalCase + "Schema" (`ProjectSchema`)
- **Factories**: camelCase + tipo (`createProject`, `createSkill`)
- **Datasets**: camelCase plural (`testDatasets.projects`)

### Empresas Brasileiras Realistas

- **Fintechs**: Nubank, Stone, Banco Inter, PagSeguro, Creditas
- **E-commerce**: iFood, MercadoLivre, Magazine Luiza, B2W Digital
- **SaaS**: Vtex, QuintoAndar, Resultados Digitais, Conta Azul, Loggi

### Localizações

- 10 capitais brasileiras (São Paulo, Rio, BH, Curitiba, etc.)
- Campinas (interior SP)
- Remoto
- Internacional

## ⚠️ Limitações e Edge Cases

### Valores Negativos

Schemas **não permitem** valores negativos em:
- `linesOfCode`, `contributors`, `commits` (min: 0)
- `yearsOfExperience` (min: 0)
- `teamSize` (min: 1)
- Performance metrics `valueBefore/After` (0-100)

Porém, `delta` **pode ser negativo** (piora de métrica).

### Datas Futuras

Projeto com `startDate` futura é edge case válido para testar:
- Validação de formulários
- Ordenação por data
- Warnings na UI

### Strings vs Números

`KpiMetric.value` aceita `string | number`:
- Use string para valores como "100% Acessível", "N/A"
- Use número para métricas quantitativas

## 📚 Referências

- [Zod Documentation](https://zod.dev)
- [TypeScript Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
- [Vitest Testing](https://vitest.dev)
- [WCAG 2.1 Levels](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Resumo**: 15 enums, 11 schemas Zod, 8 factories, 80 itens de seed (10 por tipo), 140+ testes cobrindo estados extremos (zero, negativo, alto volume, ausência de dados).

