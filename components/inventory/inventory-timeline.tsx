"use client";

type TimelineEntry = {
  id: string;
  type: string;
  qty: number;
  note: string | null;
  created_at: string;
  user_email: string | null;
};

export function InventoryTimeline({ movements }: { movements: TimelineEntry[] }): JSX.Element {
  if (movements.length === 0) {
    return <p className="text-sm text-muted-foreground">Sem movimentações registradas.</p>;
  }

  return (
    <ol className="space-y-4">
      {movements.map((movement) => (
        <li key={movement.id} className="rounded-2xl border border-border/70 bg-card/70 p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            {new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(movement.created_at))}
          </p>
          <p className="mt-2 text-sm font-semibold">
            {movement.type.toUpperCase()} · {movement.qty} unidades
          </p>
          {movement.note ? <p className="mt-1 text-sm text-muted-foreground">{movement.note}</p> : null}
          <p className="mt-1 text-xs text-muted-foreground">
            {movement.user_email ? `Responsável: ${movement.user_email}` : "Responsável não informado"}
          </p>
        </li>
      ))}
    </ol>
  );
}
