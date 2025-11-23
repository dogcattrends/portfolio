import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Início | Portfolio",
  description: "Portfolio profissional com projetos em React, Next.js, TypeScript e acessibilidade web (WCAG 2.1 AA). Componentes testados, performance otimizada e design responsivo.",
  keywords: ["portfolio", "react", "nextjs", "typescript", "acessibilidade", "wcag", "web vitals", "front-end"],
  openGraph: {
    title: "Portfolio Profissional",
    description: "Projetos em React, Next.js e TypeScript com foco em acessibilidade e performance",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio Profissional",
    description: "Projetos em React, Next.js e TypeScript com foco em acessibilidade e performance",
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Portfolio</h1>
    </main>
  );
}
