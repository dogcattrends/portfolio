import type { Metadata } from "next";
import { buildOpenGraphMetadata } from "@/lib/og-utils";

/**
 * Exemplo de metadata para página de case study
 */
export function generateCaseStudyMetadata(
  title: string,
  description: string,
  slug: string
): Metadata {
  const url = `https://portfolio.dev/cases/${slug}`;
  const imageUrl = `https://portfolio.dev/api/og?title=${encodeURIComponent(title)}`;

  const ogData = buildOpenGraphMetadata({
    title,
    description,
    url,
    image: imageUrl,
    type: "article",
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
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "pt_BR",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: ogData.title,
      description: ogData.description,
      images: [imageUrl],
    },
  };
}

/**
 * Exemplo de metadata para página home
 */
export const homeMetadata: Metadata = (() => {
  const ogData = buildOpenGraphMetadata({
    title: "Portfolio - Desenvolvedor Frontend",
    description:
      "Portfolio com cases de otimização de performance, acessibilidade e desenvolvimento web moderno. React, TypeScript, Next.js.",
    url: "https://portfolio.dev",
    image: "https://portfolio.dev/og-home.jpg",
    siteName: "Portfolio",
  });

  return {
    title: ogData.title,
    description: ogData.description,
    keywords: ["portfolio", "frontend", "react", "typescript", "acessibilidade"],
    authors: [{ name: "Seu Nome" }],
    openGraph: {
      title: ogData.title,
      description: ogData.description,
      url: ogData.url,
      siteName: ogData.siteName,
      images: ogData.image ? [{ url: ogData.image }] : [],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: ogData.title,
      description: ogData.description,
      images: ogData.image ? [ogData.image] : [],
    },
  };
})();

/**
 * Exemplo de uso dinâmico em página
 */
export async function generateMetadataForProject(_projectId: string): Promise<Metadata> {
  // Simula fetch de dados do projeto
  const project = {
    title: "Otimização de Performance em SPA React - Melhorando Core Web Vitals",
    description:
      "Case study detalhado sobre otimização de performance em Single Page Application React. Redução de 850kb para 320kb no bundle, Lighthouse score de 42 para 91. Inclui code splitting, tree-shaking, lazy loading de imagens e React.memo em componentes custosos.",
    slug: "performance-spa-react",
  };

  return generateCaseStudyMetadata(
    project.title,
    project.description,
    project.slug
  );
}
