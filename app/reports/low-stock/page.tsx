import type { Metadata } from "next";
import { getLowStockReport } from "@/lib/inventory-service";
import { LowStockTable } from "@/components/reports/low-stock-table";

export const metadata: Metadata = {
  title: "Relatório: Estoque crítico",
  description: "Itens com quantidade abaixo do mínimo com exportação CSV/Excel.",
};

export const dynamic = "force-dynamic";

export default async function LowStockReportPage() {
  const report = await getLowStockReport();
  const rows = report.map((row) => ({
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category,
    qty: row.qty,
    min_qty: row.min_qty,
    location: row.location,
  }));

  return (
    <main className="space-y-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary/80">Relatórios</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Estoque crítico</h1>
        <p className="text-sm text-muted-foreground">
          Atualizado a cada 60 segundos com SWR no edge cache. Exportações utilizam APIs nativas do browser.
        </p>
      </header>
      <LowStockTable rows={rows} />
      {rows.length === 0 && (
        <p className="text-sm text-muted-foreground">Nenhum item abaixo do mínimo.</p>
      )}
    </main>
  );
}
