"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type DeltaDirection = "positive" | "negative" | "neutral";

export interface KpiMetric {
  /** Label do KPI */
  label: string;
  /** Valor atual */
  value: string | number;
  /** Unidade de medida */
  unit?: string;
  /** Valor anterior para cálculo de delta */
  previousValue?: number;
  /** Delta em porcentagem */
  delta?: number;
  /** Direção da variação */
  direction?: DeltaDirection;
  /** Tooltip com contexto adicional */
  tooltip?: string;
  /** Descrição acessível */
  ariaDescription?: string;
}

interface CaseKpiProps {
  /** Array de métricas KPI */
  metrics: readonly KpiMetric[];
  /** Layout das métricas */
  layout?: "horizontal" | "vertical" | "grid";
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Retorna estilo e ícone baseado na direção do delta
 */
function getDeltaStyles(direction: DeltaDirection): {
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
} {
  switch (direction) {
    case "positive":
      return {
        icon: <ArrowUp className="h-3 w-3" aria-hidden="true" />,
        colorClass: "text-green-700 dark:text-green-400",
        bgClass: "bg-green-50 dark:bg-green-950/30",
      };
    case "negative":
      return {
        icon: <ArrowDown className="h-3 w-3" aria-hidden="true" />,
        colorClass: "text-red-700 dark:text-red-400",
        bgClass: "bg-red-50 dark:bg-red-950/30",
      };
    case "neutral":
      return {
        icon: <Minus className="h-3 w-3" aria-hidden="true" />,
        colorClass: "text-gray-600 dark:text-gray-400",
        bgClass: "bg-gray-50 dark:bg-gray-900/30",
      };
  }
}

/**
 * Formata o valor do delta com sinal
 */
function formatDelta(delta: number): string {
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}%`;
}

/**
 * Componente KPI individual
 */
function KpiCard({ metric }: { metric: KpiMetric }): React.JSX.Element {
  const { label, value, unit, delta, direction, tooltip, ariaDescription } = metric;
  const hasDelta = typeof delta === "number" && direction;
  const deltaStyles = direction ? getDeltaStyles(direction) : null;

  const ariaLabel = `${label}: ${value}${unit ?? ""}${
    hasDelta ? `, variação de ${formatDelta(delta)}` : ""
  }`;

  const cardContent = (
    <motion.div
      className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      data-testid={`kpi-card-${label.toLowerCase().replace(/\s+/g, "-")}`}
      role="article"
      aria-label={ariaLabel}
      aria-describedby={ariaDescription ? `desc-${label}` : undefined}
    >
      <div className="mb-1 text-sm font-medium text-muted-foreground">
        {label}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold tracking-tight" data-testid="kpi-value">
          {value}
        </div>
        {unit && (
          <span className="text-sm text-muted-foreground">{unit}</span>
        )}
      </div>

      {hasDelta && deltaStyles && (
        <div
          className={cn(
            "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            deltaStyles.colorClass,
            deltaStyles.bgClass
          )}
          data-testid="kpi-delta"
          aria-label={`Variação: ${formatDelta(delta)}`}
        >
          {deltaStyles.icon}
          <span>{formatDelta(delta)}</span>
        </div>
      )}

      {ariaDescription && (
        <span id={`desc-${label}`} className="sr-only">
          {ariaDescription}
        </span>
      )}
    </motion.div>
  );

  if (tooltip) {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
}

/**
 * Exibe KPIs com variações, tooltips e aria-descriptions
 * @example
 * <CaseKpi
 *   metrics={[
 *     {
 *       label: "Performance Score",
 *       value: 95,
 *       delta: 12.5,
 *       direction: "positive",
 *       tooltip: "Lighthouse Performance score",
 *       ariaDescription: "Melhorou de 84 para 95 após otimizações"
 *     }
 *   ]}
 * />
 */
export function CaseKpi({
  metrics,
  layout = "grid",
  className,
}: CaseKpiProps): React.JSX.Element {
  const layoutClasses = {
    horizontal: "flex gap-4 overflow-x-auto",
    vertical: "flex flex-col gap-4",
    grid: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn(layoutClasses[layout], className)}
      data-testid="case-kpi-container"
      role="region"
      aria-label="Métricas de desempenho do caso"
    >
      {metrics.map((metric, index) => (
        <KpiCard key={`${metric.label}-${index}`} metric={metric} />
      ))}
    </div>
  );
}
