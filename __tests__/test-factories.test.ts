import { describe, it, expect } from "vitest";
import { testDatasets, generateTestDataset } from "@/lib/test-factories";
import {
  ProjectStatus,
  SkillCategory,
  ProficiencyLevel,
  MetricType,
  DeltaDirection,
  ContactStatus,
} from "@/types/enums";

describe("Test Factories - Datasets", () => {
  describe("Projects Dataset", () => {
    it("deve conter 10 projetos", () => {
      expect(testDatasets.projects).toHaveLength(10);
    });

    it("deve incluir projeto com métricas zero", () => {
      const zeroMetrics = testDatasets.projects.find(
        (p) =>
          p.metrics?.linesOfCode === 0 &&
          p.metrics?.contributors === 0 &&
          p.metrics?.commits === 0
      );
      expect(zeroMetrics).toBeDefined();
      expect(zeroMetrics?.status).toBe(ProjectStatus.DRAFT);
    });

    it("deve incluir projeto com alto volume de código", () => {
      const highVolume = testDatasets.projects.find(
        (p) => p.metrics && p.metrics.linesOfCode && p.metrics.linesOfCode >= 200000
      );
      expect(highVolume).toBeDefined();
      expect(highVolume?.status).toBe(ProjectStatus.ARCHIVED);
    });

    it("deve incluir projeto featured", () => {
      const featured = testDatasets.projects.filter((p) => p.featured);
      expect(featured.length).toBeGreaterThan(0);
    });

    it("deve incluir projeto sem URLs", () => {
      const noUrls = testDatasets.projects.find(
        (p) => !p.githubUrl && !p.liveUrl
      );
      expect(noUrls).toBeDefined();
    });

    it("deve ter projeto com máximo de tags (10)", () => {
      const maxTags = testDatasets.projects.find((p) => p.tags.length === 10);
      expect(maxTags).toBeDefined();
    });

    it("todos projetos devem ter slug válido", () => {
      testDatasets.projects.forEach((project) => {
        expect(project.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      });
    });

    it("todos projetos devem ter pelo menos 1 tecnologia", () => {
      testDatasets.projects.forEach((project) => {
        expect(project.technologies.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("Skills Dataset", () => {
    it("deve conter 10 habilidades", () => {
      expect(testDatasets.skills).toHaveLength(10);
    });

    it("deve incluir skill de nível BEGINNER com 0 anos", () => {
      const beginner = testDatasets.skills.find(
        (s) =>
          s.level === ProficiencyLevel.BEGINNER && s.yearsOfExperience === 0
      );
      expect(beginner).toBeDefined();
    });

    it("deve incluir skill de nível MASTER com 15+ anos", () => {
      const master = testDatasets.skills.find(
        (s) =>
          s.level === ProficiencyLevel.MASTER && s.yearsOfExperience >= 15
      );
      expect(master).toBeDefined();
    });

    it("deve cobrir todas categorias", () => {
      const categories = testDatasets.skills.map((s) => s.category);
      expect(categories).toContain(SkillCategory.FRONTEND);
      expect(categories).toContain(SkillCategory.BACKEND);
      expect(categories).toContain(SkillCategory.DEVOPS);
      expect(categories).toContain(SkillCategory.DESIGN);
      expect(categories).toContain(SkillCategory.TOOLS);
      expect(categories).toContain(SkillCategory.SOFT_SKILLS);
    });

    it("deve incluir skill sem descrição", () => {
      const noDescription = testDatasets.skills.find((s) => !s.description);
      expect(noDescription).toBeDefined();
    });

    it("deve incluir skill sem ícone", () => {
      const noIcon = testDatasets.skills.find((s) => !s.iconUrl);
      expect(noIcon).toBeDefined();
    });
  });

  describe("Performance Metrics Dataset", () => {
    it("deve conter 10 métricas", () => {
      expect(testDatasets.performanceMetrics).toHaveLength(10);
    });

    it("deve incluir métrica com delta zero (sem mudança)", () => {
      const neutral = testDatasets.performanceMetrics.find(
        (m) => m.delta === 0 && m.direction === DeltaDirection.NEUTRAL
      );
      expect(neutral).toBeDefined();
    });

    it("deve incluir métrica com melhoria extrema (0 → 100)", () => {
      const extreme = testDatasets.performanceMetrics.find(
        (m) => m.valueBefore === 0 && m.valueAfter === 100
      );
      expect(extreme).toBeDefined();
      expect(extreme?.delta).toBe(100);
      expect(extreme?.direction).toBe(DeltaDirection.POSITIVE);
    });

    it("deve incluir métrica com piora extrema (100 → 0)", () => {
      const extremeNegative = testDatasets.performanceMetrics.find(
        (m) => m.valueBefore === 100 && m.valueAfter === 0
      );
      expect(extremeNegative).toBeDefined();
      expect(extremeNegative?.delta).toBe(-100);
      expect(extremeNegative?.direction).toBe(DeltaDirection.NEGATIVE);
    });

    it("deve cobrir todos tipos de métrica", () => {
      const types = testDatasets.performanceMetrics.map((m) => m.type);
      expect(types).toContain(MetricType.PERFORMANCE);
      expect(types).toContain(MetricType.ACCESSIBILITY);
      expect(types).toContain(MetricType.SEO);
      expect(types).toContain(MetricType.BEST_PRACTICES);
      expect(types).toContain(MetricType.PWA);
    });

    it("todos valores devem estar entre 0 e 100", () => {
      testDatasets.performanceMetrics.forEach((metric) => {
        expect(metric.valueBefore).toBeGreaterThanOrEqual(0);
        expect(metric.valueBefore).toBeLessThanOrEqual(100);
        expect(metric.valueAfter).toBeGreaterThanOrEqual(0);
        expect(metric.valueAfter).toBeLessThanOrEqual(100);
      });
    });
  });

  describe("Case Studies Dataset", () => {
    it("deve conter 10 case studies", () => {
      expect(testDatasets.caseStudies).toHaveLength(10);
    });

    it("deve incluir case com equipe pequena (1 pessoa)", () => {
      const solo = testDatasets.caseStudies.find((c) => c.teamSize === 1);
      expect(solo).toBeDefined();
    });

    it("deve incluir case com equipe grande (25+ pessoas)", () => {
      const large = testDatasets.caseStudies.find((c) => c.teamSize >= 25);
      expect(large).toBeDefined();
    });

    it("deve incluir case com duração curta (dias)", () => {
      const short = testDatasets.caseStudies.find(
        (c) => c.duration.unit === "days"
      );
      expect(short).toBeDefined();
    });

    it("deve incluir case com duração longa (anos)", () => {
      const long = testDatasets.caseStudies.find(
        (c) => c.duration.unit === "years"
      );
      expect(long).toBeDefined();
    });

    it("deve incluir empresas reais brasileiras", () => {
      const companies = testDatasets.caseStudies.map((c) => c.client);
      expect(companies).toContain("Nubank");
      expect(companies).toContain("iFood");
      expect(companies).toContain("Stone Pagamentos");
    });

    it("todos slugs devem ser válidos", () => {
      testDatasets.caseStudies.forEach((caseStudy) => {
        expect(caseStudy.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      });
    });

    it("deve incluir case featured e não-featured", () => {
      const featured = testDatasets.caseStudies.filter((c) => c.featured);
      const notFeatured = testDatasets.caseStudies.filter((c) => !c.featured);
      expect(featured.length).toBeGreaterThan(0);
      expect(notFeatured.length).toBeGreaterThan(0);
    });
  });

  describe("KPI Metrics Dataset", () => {
    it("deve conter 10 KPIs", () => {
      expect(testDatasets.kpiMetrics).toHaveLength(10);
    });

    it("deve incluir KPI com delta zero", () => {
      const neutral = testDatasets.kpiMetrics.find(
        (k) => k.delta === 0 && k.direction === DeltaDirection.NEUTRAL
      );
      expect(neutral).toBeDefined();
    });

    it("deve incluir KPI com delta negativo alto", () => {
      const negative = testDatasets.kpiMetrics.find(
        (k) => k.delta !== undefined && k.delta < -100
      );
      expect(negative).toBeDefined();
    });

    it("deve incluir KPI com delta positivo alto", () => {
      const positive = testDatasets.kpiMetrics.find(
        (k) => k.delta !== undefined && k.delta > 100
      );
      expect(positive).toBeDefined();
    });

    it("deve incluir KPI com valor string", () => {
      const stringValue = testDatasets.kpiMetrics.find(
        (k) => typeof k.value === "string"
      );
      expect(stringValue).toBeDefined();
    });

    it("deve incluir KPI sem previousValue", () => {
      const noPrevious = testDatasets.kpiMetrics.find(
        (k) => k.previousValue === undefined
      );
      expect(noPrevious).toBeDefined();
    });

    it("deve incluir KPI com valor alto (milhões)", () => {
      const highValue = testDatasets.kpiMetrics.find(
        (k) => typeof k.value === "number" && k.value > 1000000
      );
      expect(highValue).toBeDefined();
    });
  });

  describe("Tags Dataset", () => {
    it("deve conter 10 tags", () => {
      expect(testDatasets.tags).toHaveLength(10);
    });

    it("deve incluir tag com count zero (não usada)", () => {
      const unused = testDatasets.tags.find((t) => t.count === 0);
      expect(unused).toBeDefined();
    });

    it("deve incluir tag com count alto (28+)", () => {
      const popular = testDatasets.tags.find((t) => t.count >= 28);
      expect(popular).toBeDefined();
    });

    it("todos slugs devem ser válidos", () => {
      testDatasets.tags.forEach((tag) => {
        expect(tag.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      });
    });
  });

  describe("Experiences Dataset", () => {
    it("deve conter 10 experiências", () => {
      expect(testDatasets.experiences).toHaveLength(10);
    });

    it("deve incluir experiência atual (current = true)", () => {
      const current = testDatasets.experiences.filter((e) => e.current);
      expect(current.length).toBeGreaterThan(0);
    });

    it("deve incluir experiência curta (< 3 meses)", () => {
      const short = testDatasets.experiences.find((e) => {
        if (!e.endDate) return false;
        const duration = e.endDate.getTime() - e.startDate.getTime();
        const months = duration / (1000 * 60 * 60 * 24 * 30);
        return months < 3;
      });
      expect(short).toBeDefined();
    });

    it("deve incluir experiência longa (5+ anos)", () => {
      const long = testDatasets.experiences.find((e) => {
        if (!e.endDate) return false;
        const duration = e.endDate.getTime() - e.startDate.getTime();
        const years = duration / (1000 * 60 * 60 * 24 * 365);
        return years >= 5;
      });
      expect(long).toBeDefined();
    });

    it("deve cobrir todos tipos de emprego", () => {
      const types = testDatasets.experiences.map((e) => e.type);
      expect(types).toContain("full_time");
      expect(types).toContain("part_time");
      expect(types).toContain("contract");
      expect(types).toContain("freelance");
    });

    it("deve incluir experiência com muitas conquistas (5+)", () => {
      const manyAchievements = testDatasets.experiences.find(
        (e) => e.achievements.length >= 5
      );
      expect(manyAchievements).toBeDefined();
    });
  });

  describe("Contacts Dataset", () => {
    it("deve conter 10 contatos", () => {
      expect(testDatasets.contacts).toHaveLength(10);
    });

    it("deve incluir contato respondido", () => {
      const responded = testDatasets.contacts.find(
        (c) => c.status === ContactStatus.RESPONDED && c.respondedAt
      );
      expect(responded).toBeDefined();
    });

    it("deve incluir contato novo (não lido)", () => {
      const newContact = testDatasets.contacts.find(
        (c) => c.status === ContactStatus.NEW
      );
      expect(newContact).toBeDefined();
    });

    it("deve incluir contato fechado", () => {
      const closed = testDatasets.contacts.find(
        (c) => c.status === ContactStatus.CLOSED
      );
      expect(closed).toBeDefined();
    });

    it("deve incluir contato com telefone e empresa", () => {
      const complete = testDatasets.contacts.find((c) => c.phone && c.company);
      expect(complete).toBeDefined();
    });

    it("deve incluir contato sem telefone/empresa", () => {
      const minimal = testDatasets.contacts.find(
        (c) => !c.phone && !c.company
      );
      expect(minimal).toBeDefined();
    });

    it("todos emails devem ser válidos", () => {
      testDatasets.contacts.forEach((contact) => {
        expect(contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  describe("generateTestDataset helper", () => {
    it("deve retornar dataset completo sem count", () => {
      const projects = generateTestDataset("projects");
      expect(projects).toHaveLength(10);
    });

    it("deve retornar subset quando count fornecido", () => {
      const projects = generateTestDataset("projects", 3);
      expect(projects).toHaveLength(3);
    });

    it("deve funcionar para todos tipos de dataset", () => {
      expect(generateTestDataset("skills")).toHaveLength(10);
      expect(generateTestDataset("performanceMetrics")).toHaveLength(10);
      expect(generateTestDataset("caseStudies")).toHaveLength(10);
      expect(generateTestDataset("kpiMetrics")).toHaveLength(10);
      expect(generateTestDataset("tags")).toHaveLength(10);
      expect(generateTestDataset("experiences")).toHaveLength(10);
      expect(generateTestDataset("contacts")).toHaveLength(10);
    });
  });

  describe("Edge Cases - Estados Extremos", () => {
    it("deve ter projeto com data futura (edge case temporal)", () => {
      const future = testDatasets.projects.find(
        (p) => p.startDate > new Date()
      );
      expect(future).toBeDefined();
    });

    it("deve ter métrica com ambos extremos (0 e 100)", () => {
      const extremes = testDatasets.performanceMetrics.filter(
        (m) => m.valueBefore === 0 || m.valueAfter === 100
      );
      expect(extremes.length).toBeGreaterThanOrEqual(2);
    });

    it("deve ter skill com todas combinações de nível", () => {
      const levels = testDatasets.skills.map((s) => s.level);
      expect(new Set(levels).size).toBeGreaterThanOrEqual(4); // Pelo menos 4 níveis diferentes
    });

    it("deve ter case study com duração de 1 dia (urgência extrema)", () => {
      const urgent = testDatasets.caseStudies.find(
        (c) => c.duration.value === 1 && c.duration.unit === "days"
      );
      expect(urgent).toBeDefined();
    });

    it("deve ter experiência atual sem endDate", () => {
      const current = testDatasets.experiences.find(
        (e) => e.current && !e.endDate
      );
      expect(current).toBeDefined();
    });

    it("deve ter KPI com valor string (não numérico)", () => {
      const stringKpi = testDatasets.kpiMetrics.find(
        (k) => typeof k.value === "string"
      );
      expect(stringKpi).toBeDefined();
      expect(stringKpi?.previousValue).toBeUndefined();
    });
  });
});
