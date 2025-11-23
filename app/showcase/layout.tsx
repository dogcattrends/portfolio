import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showcase de Componentes | Portfolio",
  description: "Demonstração de componentes acessíveis com ARIA completo, navegação por teclado e conformidade WCAG 2.1 AA. Inclui Callout, BeforeAfter e KPI metrics.",
  keywords: [
    "componentes acessíveis",
    "aria",
    "wcag 2.1",
    "navegação por teclado",
    "screen reader",
    "lighthouse",
    "web accessibility",
    "react components",
  ],
  openGraph: {
    title: "Showcase de Componentes Acessíveis",
    description: "Demonstração de componentes com ARIA completo e navegação por teclado",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Showcase de Componentes Acessíveis",
    description: "Demonstração de componentes com ARIA completo e navegação por teclado",
  },
};

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
