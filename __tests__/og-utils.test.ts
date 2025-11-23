import { describe, it, expect } from "vitest";
import {
  buildOpenGraphTitle,
  buildOpenGraphDescription,
  isValidOGTitle,
  isValidOGDescription,
  buildOpenGraphMetadata,
  OG_LIMITS,
} from "@/lib/og-utils";

describe("buildOpenGraphTitle", () => {
  describe("Sanitização", () => {
    it("remove caracteres de controle (0x00-0x1F)", () => {
      const titleWithControl = "Title\x00with\x01control\x1Fchars";
      expect(buildOpenGraphTitle(titleWithControl)).toBe("Title with control chars");
    });

    it("remove caracteres de controle (0x7F-0x9F)", () => {
      const titleWithControl = "Title\x7Fwith\x80more\x9Fcontrol";
      expect(buildOpenGraphTitle(titleWithControl)).toBe("Title with more control");
    });

    it("remove quebras de linha (\\n)", () => {
      expect(buildOpenGraphTitle("Line 1\nLine 2")).toBe("Line 1 Line 2");
    });

    it("remove tabs (\\t)", () => {
      expect(buildOpenGraphTitle("Word1\tWord2")).toBe("Word1 Word2");
    });

    it("remove carriage return (\\r)", () => {
      expect(buildOpenGraphTitle("Text\rmore text")).toBe("Text more text");
    });

    it("normaliza múltiplos espaços em um único", () => {
      expect(buildOpenGraphTitle("Too    many     spaces")).toBe("Too many spaces");
    });

    it("remove espaços no início e fim", () => {
      expect(buildOpenGraphTitle("  Title with spaces  ")).toBe("Title with spaces");
    });
  });

  describe("Truncamento", () => {
    it("não trunca título dentro do limite (60 chars)", () => {
      const shortTitle = "Short Title";
      expect(buildOpenGraphTitle(shortTitle)).toBe(shortTitle);
    });

    it("trunca título exatamente no limite de 60 chars", () => {
      const title = "A".repeat(61);
      const result = buildOpenGraphTitle(title);
      expect(result).toHaveLength(60 + 3); // 60 + "..."
      expect(result).toMatch(/^A+\.\.\.$/);
    });

    it("trunca respeitando palavras", () => {
      const longTitle = "This is a very long title that exceeds the sixty character limit";
      const result = buildOpenGraphTitle(longTitle);
      
      expect(result.length).toBeLessThanOrEqual(63); // 60 + "..."
      expect(result).toMatch(/\.\.\.$$/);
      expect(result).not.toContain("  "); // Não deve ter espaços duplos
    });

    it("trunca na palavra anterior ao limite", () => {
      const title = "Word1 Word2 Word3 Word4 Word5 Word6 Word7 Word8 Word9 WordThatExceeds";
      const result = buildOpenGraphTitle(title);
      
      expect(result).toMatch(/\.\.\.$$/);
      expect(result.split(" ").pop()).toBe("...");
    });

    it("trunca no limite se não houver espaços", () => {
      const title = "A".repeat(70);
      const result = buildOpenGraphTitle(title);
      
      expect(result).toBe("A".repeat(60) + "...");
    });
  });

  describe("Sufixo", () => {
    it("adiciona sufixo quando fornecido", () => {
      const result = buildOpenGraphTitle("Article Title", " | Blog");
      expect(result).toBe("Article Title | Blog");
    });

    it("trunca título + sufixo combinados", () => {
      const longTitle = "This is a very long article title that needs truncation";
      const result = buildOpenGraphTitle(longTitle, " | My Blog");
      
      expect(result.length).toBeLessThanOrEqual(63); // 60 + "..."
      expect(result).toMatch(/\.\.\.$$/);
    });

    it("sanitiza sufixo também", () => {
      const result = buildOpenGraphTitle("Title", " |\nSite\x00Name");
      expect(result).toBe("Title | Site Name");
    });

    it("ignora sufixo vazio", () => {
      expect(buildOpenGraphTitle("Title", "")).toBe("Title");
    });
  });

  describe("Casos extremos", () => {
    it("retorna string vazia para título vazio", () => {
      expect(buildOpenGraphTitle("")).toBe("");
    });

    it("retorna string vazia para título apenas com espaços", () => {
      expect(buildOpenGraphTitle("   ")).toBe("");
    });

    it("retorna string vazia para título apenas com control chars", () => {
      expect(buildOpenGraphTitle("\x00\x01\x1F")).toBe("");
    });

    it("mantém caracteres Unicode válidos", () => {
      expect(buildOpenGraphTitle("Título em Português 🚀")).toBe("Título em Português 🚀");
    });

    it("mantém caracteres especiais válidos", () => {
      expect(buildOpenGraphTitle("Title: Special & Characters!")).toBe("Title: Special & Characters!");
    });
  });
});

describe("buildOpenGraphDescription", () => {
  it("sanitiza e mantém descrição curta", () => {
    const desc = "Short description";
    expect(buildOpenGraphDescription(desc)).toBe(desc);
  });

  it("remove caracteres de controle", () => {
    const desc = "Description\x00with\ncontrol\tchars";
    expect(buildOpenGraphDescription(desc)).toBe("Description with control chars");
  });

  it("trunca descrição longa em 155 chars", () => {
    const longDesc = "A".repeat(200);
    const result = buildOpenGraphDescription(longDesc);
    
    expect(result.length).toBeLessThanOrEqual(158); // 155 + "..."
    expect(result).toMatch(/\.\.\.$$/);
  });

  it("trunca respeitando palavras", () => {
    const longDesc = "This is a very long description that exceeds the one hundred fifty-five character limit and should be truncated at the last word before reaching the maximum length allowed";
    const result = buildOpenGraphDescription(longDesc);
    
    expect(result.length).toBeLessThanOrEqual(158);
    expect(result).toMatch(/\.\.\.$$/);
  });

  it("normaliza espaços", () => {
    expect(buildOpenGraphDescription("Too    many     spaces")).toBe("Too many spaces");
  });
});

describe("isValidOGTitle", () => {
  it("retorna true para título válido", () => {
    expect(isValidOGTitle("Valid Title")).toBe(true);
  });

  it("retorna false para título vazio", () => {
    expect(isValidOGTitle("")).toBe(false);
  });

  it("retorna false para título muito longo", () => {
    const longTitle = "A".repeat(61);
    expect(isValidOGTitle(longTitle)).toBe(false);
  });

  it("retorna true para título exatamente no limite", () => {
    const title = "A".repeat(60);
    expect(isValidOGTitle(title)).toBe(true);
  });
});

describe("isValidOGDescription", () => {
  it("retorna true para descrição válida", () => {
    expect(isValidOGDescription("Valid description")).toBe(true);
  });

  it("retorna false para descrição vazia", () => {
    expect(isValidOGDescription("")).toBe(false);
  });

  it("retorna false para descrição muito longa", () => {
    const longDesc = "A".repeat(156);
    expect(isValidOGDescription(longDesc)).toBe(false);
  });

  it("retorna true para descrição exatamente no limite", () => {
    const desc = "A".repeat(155);
    expect(isValidOGDescription(desc)).toBe(true);
  });
});

describe("buildOpenGraphMetadata", () => {
  const baseData = {
    title: "Article Title",
    description: "Article description",
    url: "https://example.com/article",
  };

  it("gera metadata básica", () => {
    const result = buildOpenGraphMetadata(baseData);

    expect(result.title).toBe("Article Title");
    expect(result.description).toBe("Article description");
    expect(result.url).toBe("https://example.com/article");
    expect(result.type).toBe("website");
  });

  it("adiciona siteName ao título", () => {
    const result = buildOpenGraphMetadata({
      ...baseData,
      siteName: "My Blog",
    });

    expect(result.title).toBe("Article Title | My Blog");
    expect(result.siteName).toBe("My Blog");
  });

  it("sanitiza título e descrição", () => {
    const result = buildOpenGraphMetadata({
      title: "Title\nwith\x00control",
      description: "Description\twith\rcontrol",
      url: "https://example.com",
    });

    expect(result.title).toBe("Title with control");
    expect(result.description).toBe("Description with control");
  });

  it("trunca título longo com siteName", () => {
    const result = buildOpenGraphMetadata({
      title: "This is a very long article title that will be truncated",
      description: "Description",
      url: "https://example.com",
      siteName: "My Site",
    });

    expect(result.title.length).toBeLessThanOrEqual(63);
    expect(result.title).toContain("...");
  });

  it("define type como article quando fornecido", () => {
    const result = buildOpenGraphMetadata({
      ...baseData,
      type: "article",
    });

    expect(result.type).toBe("article");
  });

  it("inclui imagem quando fornecida", () => {
    const result = buildOpenGraphMetadata({
      ...baseData,
      image: "https://example.com/image.jpg",
    });

    expect(result.image).toBe("https://example.com/image.jpg");
  });
});

describe("OG_LIMITS", () => {
  it("define limite de título como 60", () => {
    expect(OG_LIMITS.TITLE_MAX).toBe(60);
  });

  it("define limite de descrição como 155", () => {
    expect(OG_LIMITS.DESCRIPTION_MAX).toBe(155);
  });
});
