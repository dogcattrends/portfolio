/**
 * Exemplos de uso das utilities Open Graph
 */

import { buildOpenGraphTitle, buildOpenGraphMetadata } from "@/lib/og-utils";

/**
 * Exemplo 1: Título simples
 */
export function exampleSimpleTitle(): void {
  const title = buildOpenGraphTitle("My Article Title");
  console.log(title); // "My Article Title"
}

/**
 * Exemplo 2: Título com sufixo (site name)
 */
export function exampleTitleWithSuffix(): void {
  const title = buildOpenGraphTitle("Best Practices for React", " | Dev Blog");
  console.log(title); // "Best Practices for React | Dev Blog"
}

/**
 * Exemplo 3: Título longo que será truncado
 */
export function exampleLongTitle(): void {
  const longTitle = "Complete Guide to TypeScript: Everything You Need to Know About Types";
  const title = buildOpenGraphTitle(longTitle, " | TypeScript Blog");
  console.log(title); // "Complete Guide to TypeScript: Everything You Need to..."
}

/**
 * Exemplo 4: Título com caracteres de controle
 */
export function exampleTitleWithControlChars(): void {
  const dirtyTitle = "Article\nTitle\twith\x00control\rcharacters";
  const title = buildOpenGraphTitle(dirtyTitle);
  console.log(title); // "Article Title with control characters"
}

/**
 * Exemplo 5: Metadata completa para página de artigo
 */
export function exampleArticleMetadata(): void {
  const metadata = buildOpenGraphMetadata({
    title: "How to Build Accessible Components",
    description: "Learn how to create accessible React components with ARIA, keyboard navigation, and screen reader support. Includes practical examples and testing strategies.",
    url: "https://myblog.com/accessible-components",
    image: "https://myblog.com/images/a11y-guide.jpg",
    type: "article",
    siteName: "Dev Blog",
  });

  console.log(metadata);
  /*
  {
    title: "How to Build Accessible Components | Dev Blog",
    description: "Learn how to create accessible React components with ARIA, keyboard navigation, and screen reader support. Includes practical examples...",
    url: "https://myblog.com/accessible-components",
    image: "https://myblog.com/images/a11y-guide.jpg",
    type: "article",
    siteName: "Dev Blog"
  }
  */
}

/**
 * Exemplo 6: Uso em Next.js Metadata
 */
export function exampleNextJsMetadata() {
  const ogData = buildOpenGraphMetadata({
    title: "Portfolio - Case Studies",
    description: "Explore my recent projects showcasing performance optimization, accessibility improvements, and modern web development techniques.",
    url: "https://portfolio.dev/cases",
    image: "https://portfolio.dev/og-image.jpg",
    siteName: "Portfolio",
  });

  return {
    title: ogData.title,
    description: ogData.description,
    openGraph: {
      title: ogData.title,
      description: ogData.description,
      url: ogData.url,
      siteName: ogData.siteName,
      images: ogData.image ? [{ url: ogData.image }] : [],
      type: ogData.type,
    },
    twitter: {
      card: "summary_large_image",
      title: ogData.title,
      description: ogData.description,
      images: ogData.image ? [ogData.image] : [],
    },
  };
}

/**
 * Exemplo 7: Sanitização de conteúdo de CMS
 */
export function exampleCMSContent(): void {
  // Conteúdo vindo de CMS pode ter formatação inesperada
  const cmsTitle = `
    My   Title   
    With    Multiple    Spaces
    And\nLine\rBreaks\x00
  `;

  const title = buildOpenGraphTitle(cmsTitle, " | CMS");
  console.log(title); // "My Title With Multiple Spaces And Line Breaks | CMS"
}

/**
 * Exemplo 8: Múltiplos idiomas
 */
export function exampleMultipleLanguages(): void {
  const titles = [
    buildOpenGraphTitle("Tutorial de React", " | Blog PT"),
    buildOpenGraphTitle("React Tutorial", " | Blog EN"),
    buildOpenGraphTitle("Tutoriel React", " | Blog FR"),
    buildOpenGraphTitle("Урок по React", " | Blog RU"),
    buildOpenGraphTitle("React チュートリアル", " | Blog JP"),
  ];

  titles.forEach(title => console.log(title));
}
