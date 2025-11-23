import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/cases", label: "Cases" },
];

export default function CasesLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        href="#cases-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Pular para o conteúdo
      </a>
      <header
        role="banner"
        className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur"
      >
        <nav
          aria-label="Navegação principal"
          className="container mx-auto flex items-center justify-between px-4 py-4"
        >
          <Link
            href="/"
            className="text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Portfolio
          </Link>
          <div className="flex items-center gap-6">
            <ul className="flex items-center gap-4 text-sm font-medium">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "rounded-full px-3 py-1 transition hover:bg-muted",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main
        id="cases-main"
        role="main"
        className="container mx-auto px-4 py-10"
        tabIndex={-1}
      >
        {children}
      </main>
      <footer
        role="contentinfo"
        className="mt-16 border-t border-border/40 bg-muted/30 py-6 text-center text-sm text-muted-foreground"
      >
        © {new Date().getFullYear()} - Cases selecionados.
      </footer>
    </div>
  );
}
