"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type InventoryGridProps = {
  initialData: {
    items: Array<{
      id: string;
      sku: string;
      name: string;
      category: string;
      location: string | null;
      status: string;
      qty: number;
      min_qty: number;
    }>;
    stats: {
      total: number;
      lowStock: number;
      status: Record<string, number>;
    };
  };
  queryString: string;
};

function buildApiUrl(queryString: string): string {
  const url = new URL("/api/inventory", window.location.origin);
  if (queryString) {
    url.search = queryString;
  }
  return url.toString();
}

export function InventoryGrid({ initialData, queryString }: InventoryGridProps): JSX.Element {
  const [data, setData] = useState(initialData);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    async function load() {
      setStatus("loading");
      setErrorMessage(null);
      try {
        const response = await fetch(buildApiUrl(queryString), {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("Falha ao carregar inventário.");
        }

        const payload = await response.json();
        if (!ignore) {
          setData(payload);
          setStatus("idle");
        }
      } catch (error) {
        if (!ignore && !(error instanceof DOMException && error.name === "AbortError")) {
          setStatus("error");
          setErrorMessage("Não foi possível carregar os itens. Tente novamente.");
        }
      }
    }

    load();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [queryString]);

  const cards = useMemo(() => data.items, [data.items]);

  return (
    <section aria-live="polite" className="space-y-4">
      <header className="flex flex-wrap items-center gap-6 rounded-2xl border border-border/60 bg-muted/20 p-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Itens</p>
          <p className="text-2xl font-semibold">{data.stats.total}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Abaixo do mínimo</p>
          <p className="text-2xl font-semibold text-amber-500">{data.stats.lowStock}</p>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          {status === "loading" && "Atualizando lista..."}
          {status === "error" && errorMessage}
        </div>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => (
          <article
            key={item.id}
            className="flex flex-col rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm"
          >
            <header className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{item.sku}</p>
                <h2 className="text-xl font-semibold">{item.name}</h2>
              </div>
              <span
                className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                data-status={item.status}
              >
                {item.status}
              </span>
            </header>
            <dl className="mt-4 grid grid-cols-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Categoria</dt>
                <dd>{item.category}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Local</dt>
                <dd>{item.location ?? "—"}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Estoque</p>
                <p className="text-lg font-semibold">
                  {item.qty} <span className="text-sm text-muted-foreground">/ {item.min_qty}</span>
                </p>
              </div>
              {item.qty <= item.min_qty ? (
                <p className="text-xs font-semibold text-amber-600">Repor</p>
              ) : (
                <p className="text-xs text-emerald-600">Saudável</p>
              )}
            </div>
            <Link
              href={`/inventory/${item.id}`}
              className="mt-4 inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Detalhes
            </Link>
          </article>
        ))}
      </div>
      {cards.length === 0 && status !== "loading" && (
        <p className="rounded-2xl border border-dashed border-border/60 px-4 py-6 text-center text-muted-foreground">
          Nenhum item corresponde aos filtros escolhidos.
        </p>
      )}
    </section>
  );
}
