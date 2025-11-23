import type { Metadata } from "next";

import { InventoryFilters } from "@/components/inventory/inventory-filters";
import { InventoryGrid } from "@/components/inventory/inventory-grid";
import { getInventoryList } from "@/lib/inventory-service";

export const metadata: Metadata = {
  title: "Inventário",
  description: "Monitoramento de itens com filtros persistentes e alertas de estoque.",
};

export const dynamic = "force-dynamic";

type InventoryPageProps = {
  searchParams?: {
    search?: string;
    status?: string;
    category?: string;
    location?: string;
    org_id?: string;
  };
};

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const filters = {
    search: searchParams?.search,
    status: searchParams?.status as any,
    category: searchParams?.category,
    location: searchParams?.location,
    orgId: searchParams?.org_id,
  };
  const data = await getInventoryList(filters);
  const query = buildQuery(searchParams);

  return (
    <main className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary/80">Inventário</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Itens em estoque</h1>
        <p className="text-sm text-muted-foreground">
          Filtros persistem via URL para compartilhamento com o time.
        </p>
      </header>
      <InventoryFilters categories={data.facets.categories} locations={data.facets.locations} />
      <InventoryGrid initialData={{ items: data.items, stats: data.stats }} queryString={query} />
    </main>
  );
}

function buildQuery(searchParams?: Record<string, string | undefined>) {
  if (!searchParams) return "";
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return params.toString();
}
