import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getInventoryDetail } from "@/lib/inventory-service";
import { InventoryTimeline } from "@/components/inventory/inventory-timeline";

type InventoryDetailProps = {
  params: { id: string };
};

export const metadata: Metadata = {
  title: "Detalhes do item",
};

export const dynamic = "force-dynamic";

export default async function InventoryDetailPage({ params }: InventoryDetailProps) {
  try {
    const { item, movements } = await getInventoryDetail(params.id);
    return (
      <main className="space-y-8">
        <Link href="/inventory" className="text-sm text-primary underline-offset-4 hover:underline">
          ← Voltar para inventário
        </Link>
        <header className="space-y-3 rounded-3xl border border-border/60 bg-card/70 p-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{item.sku}</p>
          <h1 className="text-4xl font-bold text-foreground">{item.name}</h1>
          <dl className="grid gap-4 md:grid-cols-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Categoria</dt>
              <dd>{item.category}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Local</dt>
              <dd>{item.location ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-semibold">{item.status}</dd>
            </div>
          </dl>
          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Estoque atual</p>
            <p className="text-3xl font-semibold">
              {item.qty} <span className="text-base text-muted-foreground">/ {item.min_qty}</span>
            </p>
            {item.qty <= item.min_qty ? (
              <p className="text-sm text-amber-600">Abaixo do mínimo — priorize recomposição.</p>
            ) : (
              <p className="text-sm text-emerald-600">Nível saudável.</p>
            )}
          </div>
        </header>
        <section>
          <h2 className="text-2xl font-semibold text-foreground">Linha do tempo</h2>
          <InventoryTimeline movements={movements} />
        </section>
      </main>
    );
  } catch {
    notFound();
  }
}
