"use client";

import Fuse from "fuse.js";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { CaseSummary } from "@/lib/cases";
import type { CasesLocale, CasesDictionary } from "@/lib/i18n/cases";
import { cn } from "@/lib/utils";

type ExplorerProps = {
  initialCases: CaseSummary[];
  tags: string[];
  dictionary: CasesDictionary;
  locale: CasesLocale;
};

type SearchCase = CaseSummary & {
  formattedDate: string;
};

export function CasesExplorer({
  initialCases,
  tags,
  dictionary,
  locale,
}: ExplorerProps): JSX.Element {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const casesWithDate = useMemo<SearchCase[]>(
    () =>
      initialCases.map((item) => ({
        ...item,
        formattedDate: new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
          dateStyle: "medium",
        }).format(new Date(item.date)),
      })),
    [initialCases, locale],
  );

  const fuse = useMemo(
    () =>
      new Fuse(casesWithDate, {
        keys: ["title", "summary", "client", "industry", "tags"],
        threshold: 0.35,
      }),
    [casesWithDate],
  );

  const filteredCases = useMemo(() => {
    const base = query.trim().length > 0 ? fuse.search(query).map((result) => result.item) : casesWithDate;
    if (selectedTag === "all") {
      return base;
    }
    return base.filter((item) => item.tags.includes(selectedTag));
  }, [casesWithDate, fuse, query, selectedTag]);

  const tagOptions = ["all", ...tags];

  const caseHref = (slug: string): string =>
    locale === "en" ? `/cases/${slug}?lang=en` : `/cases/${slug}`;

  const resultLabel = (count: number): string => {
    if (locale === "en") {
      return count === 1 ? "case" : "cases";
    }
    return count === 1 ? "caso" : "casos";
  };

  return (
    <div className="space-y-6">
      <form role="search" className="grid gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm">
        <label className="text-sm font-semibold text-muted-foreground" htmlFor="cases-search">
          {dictionary.searchPlaceholder}
        </label>
        <input
          id="cases-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={dictionary.searchPlaceholder}
          className="w-full rounded-full border border-border/70 bg-background px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-muted-foreground">
          <label htmlFor="tag-filter">{dictionary.filterLabel}</label>
          <select
            id="tag-filter"
            value={selectedTag}
            onChange={(event) => setSelectedTag(event.target.value)}
            className="rounded-full border border-border/70 bg-background px-3 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {tagOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag === "all" ? (locale === "en" ? "All" : "Todas") : tag}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setSelectedTag("all");
              setQuery("");
            }}
            className="rounded-full border border-dashed border-border px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            {dictionary.clearFilter}
          </button>
          <span className="ml-auto text-xs uppercase tracking-widest text-muted-foreground">
            {filteredCases.length} {resultLabel(filteredCases.length)}
          </span>
        </div>
      </form>

      {filteredCases.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-6 text-center text-muted-foreground">
          {dictionary.emptyState}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredCases.map((item) => (
            <article
              key={item.slug}
              className="group flex h-full flex-col rounded-3xl border border-border/60 bg-card/80 shadow-sm transition hover:border-primary/60"
            >
              <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
                <Image
                  src={item.cover}
                  alt={item.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
                  <span>{item.client}</span>
                  <span>{item.formattedDate}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={`${item.slug}-${tag}`}
                      className="rounded-full border border-border/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex flex-wrap gap-4 text-sm font-semibold">
                  {item.metrics.map((metric) => (
                    <div key={`${item.slug}-${metric.label}`}>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {metric.label}
                      </p>
                      <p>{metric.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{dictionary.readingTime(item.readingMinutes)}</p>
                  <Link
                    href={caseHref(item.slug)}
                    className={cn(
                      "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    )}
                  >
                    {dictionary.readCase}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
