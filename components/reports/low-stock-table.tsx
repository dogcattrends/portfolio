"use client";

type LowStockRow = {
  id: string;
  sku: string;
  name: string;
  category: string;
  qty: number;
  min_qty: number;
  location: string | null;
};

type ExportFormat = "csv" | "excel";

export function LowStockTable({ rows }: { rows: LowStockRow[] }): JSX.Element {
  const handleExport = (format: ExportFormat) => {
    if (rows.length === 0) return;
    const headers = ["SKU", "Nome", "Categoria", "Quantidade", "Mínimo", "Local"];
    const dataLines = rows.map((row) => [
      row.sku,
      row.name,
      row.category,
      row.qty.toString(),
      row.min_qty.toString(),
      row.location ?? "",
    ]);

    if (format === "csv") {
      const csv = [headers, ...dataLines]
        .map((line) => line.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
        .join("\n");
      downloadFile(csv, "text/csv;charset=utf-8;", "low-stock.csv");
      return;
    }

    const tableRows = [headers, ...dataLines]
      .map(
        (line) =>
          `<tr>${line.map((cell) => `<td>${cell}</td>`).join("")}</tr>`,
      )
      .join("");
    const html = `<table>${tableRows}</table>`;
    downloadFile(html, "application/vnd.ms-excel", "low-stock.xls");
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleExport("csv")}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Exportar CSV
        </button>
        <button
          type="button"
          onClick={() => handleExport("excel")}
          className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Exportar Excel
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-border/60">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/30">
            <tr>
              <th scope="col" className="px-4 py-2 text-left font-semibold">SKU</th>
              <th scope="col" className="px-4 py-2 text-left font-semibold">Nome</th>
              <th scope="col" className="px-4 py-2 text-left font-semibold">Categoria</th>
              <th scope="col" className="px-4 py-2 text-left font-semibold">Qtd.</th>
              <th scope="col" className="px-4 py-2 text-left font-semibold">Mínimo</th>
              <th scope="col" className="px-4 py-2 text-left font-semibold">Local</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id} className={row.qty <= row.min_qty ? "bg-amber-50/60 dark:bg-amber-500/10" : undefined}>
                <td className="px-4 py-2 font-mono text-xs uppercase tracking-widest">{row.sku}</td>
                <td className="px-4 py-2 font-medium">{row.name}</td>
                <td className="px-4 py-2">{row.category}</td>
                <td className="px-4 py-2">{row.qty}</td>
                <td className="px-4 py-2">{row.min_qty}</td>
                <td className="px-4 py-2">{row.location ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function downloadFile(content: string, type: string, filename: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
