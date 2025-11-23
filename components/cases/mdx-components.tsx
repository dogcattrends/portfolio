'use client';

import type { ReactNode } from "react";

import { logAnalyticsEvent } from "@/lib/analytics/client";
import { cn } from "@/lib/utils";

type CalloutIntent = "info" | "warning" | "success";

const intentStyles: Record<CalloutIntent, string> = {
  info: "border-blue-300/60 bg-blue-50 text-blue-900 dark:border-blue-500/50 dark:bg-blue-500/10 dark:text-blue-100",
  warning: "border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-500/50 dark:bg-amber-500/10 dark:text-amber-100",
  success: "border-emerald-300/60 bg-emerald-50 text-emerald-900 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-100",
};

export function Callout({
  intent = "info",
  title,
  children,
}: {
  intent?: CalloutIntent;
  title?: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <div
      role="note"
      className={cn(
        "my-6 rounded-xl border px-4 py-3 text-sm shadow-sm backdrop-blur",
        intentStyles[intent],
      )}
    >
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      <div className="[&>*:last-child]:mb-0">{children}</div>
    </div>
  );
}

type KpiItem = {
  label: string;
  value: string;
  direction?: "positive" | "negative" | "neutral";
  description?: string;
};

const directionColors: Record<NonNullable<KpiItem["direction"]>, string> = {
  positive: "text-emerald-600 dark:text-emerald-300",
  negative: "text-rose-600 dark:text-rose-300",
  neutral: "text-muted-foreground",
};

export function KPI({ items }: { items: KpiItem[] }): JSX.Element {
  return (
    <div
      className="my-8 grid gap-4 md:grid-cols-3"
      role="region"
      aria-label="Indicadores principais"
    >
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          role="button"
          tabIndex={0}
          onClick={() => logAnalyticsEvent("kpi_expand", { label: item.label, value: item.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              logAnalyticsEvent("kpi_expand", { label: item.label, value: item.value });
            }
          }}
          className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {item.label}
          </p>
          <p
            className={cn(
              "mt-2 text-2xl font-semibold",
              item.direction ? directionColors[item.direction] : "text-foreground",
            )}
          >
            {item.value}
          </p>
          {item.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function BeforeAfter({
  beforeTitle,
  beforeDescription,
  afterTitle,
  afterDescription,
}: {
  beforeTitle: string;
  beforeDescription: string;
  afterTitle: string;
  afterDescription: string;
}): JSX.Element {
  return (
    <div className="my-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-border/70 bg-muted/30 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Antes
        </p>
        <h4 className="mt-1 text-lg font-semibold">{beforeTitle}</h4>
        <p className="mt-2 text-sm text-muted-foreground">{beforeDescription}</p>
      </div>
      <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Depois
        </p>
        <h4 className="mt-1 text-lg font-semibold text-primary-foreground">
          {afterTitle}
        </h4>
        <p className="mt-2 text-sm text-primary-foreground/80">
          {afterDescription}
        </p>
      </div>
    </div>
  );
}

export function Code({
  children,
  language = "tsx",
}: {
  children: string;
  language?: string;
}): JSX.Element {
  return (
    <pre className="my-6 overflow-x-auto rounded-2xl border border-border/70 bg-zinc-950 p-4 text-sm text-zinc-100">
      <code className="font-mono">
        <span className="sr-only">Código {language}</span>
        {children.trim()}
      </code>
    </pre>
  );
}

export function Video({
  title,
  caption,
  src,
}: {
  title: string;
  caption?: string;
  src: string;
}): JSX.Element {
  return (
    <figure className="my-8 space-y-3">
      <video
        className="w-full rounded-3xl border border-border/80 shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        controls
        playsInline
        aria-label={title}
      >
        <source src={src} />
      </video>
      <figcaption className="text-sm text-muted-foreground">{caption ?? title}</figcaption>
    </figure>
  );
}
