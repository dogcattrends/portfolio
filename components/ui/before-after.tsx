"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BeforeAfterProps {
  /** URL da imagem "antes" */
  beforeImage: string;
  /** URL da imagem "depois" */
  afterImage: string;
  /** Alt text da imagem "antes" */
  beforeAlt: string;
  /** Alt text da imagem "depois" */
  afterAlt: string;
  /** Label customizado para "antes" */
  beforeLabel?: string;
  /** Label customizado para "depois" */
  afterLabel?: string;
  /** Posição inicial do slider (0-100) */
  defaultPosition?: number;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Componente de comparação before/after com slider acessível
 * @example
 * <BeforeAfter
 *   beforeImage="/before.jpg"
 *   afterImage="/after.jpg"
 *   beforeAlt="Página antes da otimização"
 *   afterAlt="Página após otimização"
 * />
 */
export const BeforeAfter = React.forwardRef<HTMLDivElement, BeforeAfterProps>(
  (
    {
      beforeImage,
      afterImage,
      beforeAlt,
      afterAlt,
      beforeLabel = "Antes",
      afterLabel = "Depois",
      defaultPosition = 50,
      className,
    },
    ref
  ) => {
    const [sliderPosition, setSliderPosition] = React.useState(defaultPosition);
    const [isDragging, setIsDragging] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const handleMove = React.useCallback((clientX: number): void => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    }, []);

    const handleMouseMove = React.useCallback(
      (e: MouseEvent): void => {
        if (isDragging) {
          handleMove(e.clientX);
        }
      },
      [isDragging, handleMove]
    );

    const handleTouchMove = React.useCallback(
      (e: TouchEvent): void => {
        if (isDragging && e.touches[0]) {
          handleMove(e.touches[0].clientX);
        }
      },
      [isDragging, handleMove]
    );

    const handleEnd = React.useCallback((): void => {
      setIsDragging(false);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent): void => {
      const step = e.shiftKey ? 10 : 1;
      
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          setSliderPosition((prev) => Math.max(0, prev - step));
          break;
        case "ArrowRight":
          e.preventDefault();
          setSliderPosition((prev) => Math.min(100, prev + step));
          break;
        case "Home":
          e.preventDefault();
          setSliderPosition(0);
          break;
        case "End":
          e.preventDefault();
          setSliderPosition(100);
          break;
      }
    };

    React.useEffect(() => {
      if (isDragging) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleEnd);
        window.addEventListener("touchmove", handleTouchMove);
        window.addEventListener("touchend", handleEnd);

        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleEnd);
          window.removeEventListener("touchmove", handleTouchMove);
          window.removeEventListener("touchend", handleEnd);
        };
      }
    }, [isDragging, handleMouseMove, handleTouchMove, handleEnd]);

    return (
      <div
        ref={ref}
        className={cn("relative select-none overflow-hidden rounded-lg", className)}
        data-testid="before-after-container"
        role="group"
        aria-label="Comparação antes e depois"
      >
        <div ref={containerRef} className="relative aspect-video w-full">
          {/* Imagem "Depois" (background) */}
          <div className="absolute inset-0">
            <img
              src={afterImage}
              alt={afterAlt}
              className="h-full w-full object-cover"
              draggable={false}
              data-testid="after-image"
            />
            <div className="absolute right-4 top-4 rounded-md bg-black/70 px-3 py-1 text-xs font-medium text-white">
              {afterLabel}
            </div>
          </div>

          {/* Imagem "Antes" (foreground com clip) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={beforeImage}
              alt={beforeAlt}
              className="h-full w-full object-cover"
              draggable={false}
              data-testid="before-image"
            />
            <div className="absolute left-4 top-4 rounded-md bg-black/70 px-3 py-1 text-xs font-medium text-white">
              {beforeLabel}
            </div>
          </div>

          {/* Slider */}
          <div
            className="absolute inset-y-0 flex cursor-ew-resize items-center"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="relative">
              {/* Linha */}
              <div className="h-full w-0.5 bg-white shadow-lg" />

              {/* Handle */}
              <motion.button
                type="button"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg ring-offset-background transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
                onKeyDown={handleKeyDown}
                aria-label={`Ajustar comparação, posição atual ${Math.round(sliderPosition)}%`}
                aria-valuenow={Math.round(sliderPosition)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={`${Math.round(sliderPosition)}% antes, ${Math.round(100 - sliderPosition)}% depois`}
                role="slider"
                tabIndex={0}
                data-testid="slider-handle"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="h-4 w-4 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

BeforeAfter.displayName = "BeforeAfter";
