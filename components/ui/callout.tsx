"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const calloutVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current [&>svg~*]:pl-8",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-200",
        success: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/30 dark:text-green-200",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-200",
        error: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
} as const;

const ariaLiveMap = {
  default: "polite",
  info: "polite",
  success: "polite",
  warning: "assertive",
  error: "assertive",
} as const;

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  /** Título do callout */
  title?: string;
  /** Mostra ícone baseado no variant */
  showIcon?: boolean;
  /** Permite fechar o callout */
  dismissible?: boolean;
  /** Callback ao fechar */
  onDismiss?: () => void;
}

/**
 * Componente de alerta/callout acessível com variantes
 * @example
 * <Callout variant="warning" title="Atenção">
 *   Este recurso está em beta
 * </Callout>
 */
export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      className,
      variant = "default",
      title,
      showIcon = true,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const [dismissed, setDismissed] = React.useState(false);
    const Icon = iconMap[variant ?? "default"];
    const ariaLive = ariaLiveMap[variant ?? "default"];

    const handleDismiss = (): void => {
      setDismissed(true);
      onDismiss?.();
    };

    if (dismissed) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={ariaLive}
        aria-atomic="true"
        className={cn(calloutVariants({ variant }), className)}
        data-testid={`callout-${variant}`}
        {...props}
      >
        {showIcon && (
          <Icon
            className="h-5 w-5"
            aria-hidden="true"
            data-testid="callout-icon"
          />
        )}
        <div className="flex-1">
          {title && (
            <h5 className="mb-1 font-semibold leading-none tracking-tight" data-testid="callout-title">
              {title}
            </h5>
          )}
          <div className="text-sm [&_p]:leading-relaxed" data-testid="callout-content">
            {children}
          </div>
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute right-2 top-2 rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Fechar alerta"
            data-testid="callout-dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Callout.displayName = "Callout";
