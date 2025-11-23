"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type InventoryFiltersProps = {
  categories: string[];
  locations: Array<string | null>;
};

const STATUS_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Novos", value: "new" },
  { label: "Usados", value: "used" },
  { label: "Em reparo", value: "repair" },
];

export function InventoryFilters({ categories, locations }: InventoryFiltersProps): JSX.Element {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <fieldset className="flex flex-wrap gap-4 rounded-2xl border border-border/60 bg-card/60 p-4" aria-busy={isPending}>
      <legend className="text-sm font-semibold text-muted-foreground">Filtros</legend>
      <label className="flex flex-col text-sm font-medium text-muted-foreground">
        Status
        <select
          className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          defaultValue={searchParams.get("status") ?? ""}
          onChange={(event) => handleChange("status", event.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col text-sm font-medium text-muted-foreground">
        Categoria
        <select
          className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          defaultValue={searchParams.get("category") ?? ""}
          onChange={(event) => handleChange("category", event.target.value)}
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col text-sm font-medium text-muted-foreground">
        Local
        <select
          className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          defaultValue={searchParams.get("location") ?? ""}
          onChange={(event) => handleChange("location", event.target.value)}
        >
          <option value="">Todos</option>
          {locations
            .filter((location): location is string => Boolean(location))
            .map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
        </select>
      </label>
      <label className="flex flex-1 flex-col text-sm font-medium text-muted-foreground">
        Busca
        <input
          type="search"
          placeholder="SKU ou nome"
          defaultValue={searchParams.get("search") ?? ""}
          onBlur={(event) => handleChange("search", event.target.value)}
          className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <span className="sr-only" aria-live="polite">
          {isPending ? "Atualizando lista" : "Filtros aplicados"}
        </span>
      </label>
    </fieldset>
  );
}
