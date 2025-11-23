"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ChevronDown, Download, Search, X, AlertCircle } from "lucide-react";
import * as React from "react";

import { useTranslations, type Locale } from "@/lib/i18n/ui";
import { cn } from "@/lib/utils";
import { isNonEmpty, getErrorMessage } from "@/lib/utils/errors";

/**
 * Direção de ordenação
 */
export type SortDirection = "asc" | "desc" | null;

/**
 * Configuração de coluna
 */
export interface DataGridColumn<T> {
  /** Chave da propriedade no objeto */
  key: keyof T;
  /** Label exibida no cabeçalho */
  label: string;
  /** Se a coluna é ordenável */
  sortable?: boolean;
  /** Se a coluna é filtrável */
  filterable?: boolean;
  /** Função customizada de renderização */
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  /** Largura da coluna (CSS width) */
  width?: string;
  /** Alinhamento do conteúdo */
  align?: "left" | "center" | "right";
}

/**
 * Opções de exportação
 */
export interface ExportOptions {
  /** Nome do arquivo (sem extensão) */
  filename?: string;
  /** Incluir apenas colunas específicas */
  columns?: string[];
}

/**
 * Props do DataGrid
 */
export interface DataGridProps<T> {
  /** Dados a serem exibidos */
  data: T[];
  /** Configuração das colunas */
  columns: DataGridColumn<T>[];
  /** Chave única para cada linha (para React key) */
  rowKey: keyof T;
  /** Callback ao clicar em uma linha */
  onRowClick?: (row: T) => void;
  /** Callback ao pressionar Enter em uma linha */
  onRowActivate?: (row: T) => void;
  /** Se o grid é ordenável */
  sortable?: boolean;
  /** Se o grid é filtrável */
  filterable?: boolean;
  /** Se o grid permite exportação CSV */
  exportable?: boolean;
  /** Label para acessibilidade */
  ariaLabel?: string;
  /** Mensagem quando não há dados */
  emptyMessage?: string;
  /** Classe CSS customizada */
  className?: string;
  /** Locale para i18n */
  locale?: Locale;
  /** Estado de loading */
  isLoading?: boolean;
  /** Erro ao carregar dados */
  error?: Error | null;
  /** Callback para tentar carregar novamente */
  onRetry?: () => void;
}

/**
 * Estado de ordenação
 */
interface SortState {
  column: string | null;
  direction: SortDirection;
}

/**
 * Estado de navegação por teclado
 */
interface KeyboardState {
  focusedRow: number;
  focusedColumn: number;
}

/**
 * Data Grid com navegação por teclado, ordenação, filtros e exportação CSV
 */
export function DataGrid<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  onRowClick,
  onRowActivate,
  sortable = true,
  filterable = true,
  exportable = true,
  ariaLabel = "Tabela de dados",
  emptyMessage,
  className,
  locale = "pt",
  isLoading = false,
  error = null,
  onRetry,
}: DataGridProps<T>) {
  const t = useTranslations(locale);
  const [sortState, setSortState] = React.useState<SortState>({
    column: null,
    direction: null,
  });
  const [filters, setFilters] = React.useState<Record<string, string>>({});
  const [keyboardState, setKeyboardState] = React.useState<KeyboardState>({
    focusedRow: -1,
    focusedColumn: -1,
  });
  const [announceMessage, setAnnounceMessage] = React.useState("");

  const gridRef = React.useRef<HTMLDivElement>(null);
  const rowRefs = React.useRef<Map<number, HTMLDivElement>>(new Map());

  /**
   * Filtra dados baseado nos filtros ativos
   */
  const filteredData = React.useMemo(() => {
    if (Object.keys(filters).length === 0) return data;

    return data.filter((row) => {
      return Object.entries(filters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const cellValue = String(row[key as keyof T] ?? "").toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    });
  }, [data, filters]);

  /**
   * Ordena dados baseado no estado de ordenação
   */
  const sortedData = React.useMemo(() => {
    if (!sortState.column || !sortState.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortState.column as keyof T];
      const bValue = b[sortState.column as keyof T];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortState.direction === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortState]);

  /**
   * Alterna ordenação de coluna
   */
  const handleSort = React.useCallback(
    (columnKey: string) => {
      setSortState((prev) => {
        if (prev.column !== columnKey) {
          return { column: columnKey, direction: "asc" };
        }
        if (prev.direction === "asc") {
          return { column: columnKey, direction: "desc" };
        }
        return { column: null, direction: null };
      });
    },
    []
  );

  /**
   * Atualiza filtro de coluna
   */
  const handleFilter = React.useCallback(
    (columnKey: string, value: string) => {
      setFilters((prev) => {
        const newFilters = { ...prev };
        if (value) {
          newFilters[columnKey] = value;
        } else {
          delete newFilters[columnKey];
        }

        // Anunciar mudança de filtro
        const filterCount = Object.keys(newFilters).length;
        if (filterCount > 0) {
          setAnnounceMessage(t.dataGrid.filterApplied(filterCount));
        } else {
          setAnnounceMessage(`${t.common.clear}. ${data.length} itens exibidos.`);
        }

        return newFilters;
      });
    },
    [data.length, t]
  );

  /**
   * Limpa todos os filtros
   */
  const handleClearFilters = React.useCallback(() => {
    setFilters({});
    setAnnounceMessage(`${t.common.clear}. ${data.length} itens exibidos.`);
  }, [data.length, t]);

  /**
   * Exporta dados para CSV
   */
  const handleExport = React.useCallback(
    (options: ExportOptions = {}) => {
      const { filename = "export", columns: exportColumns } = options;

      const columnsToExport = exportColumns
        ? columns.filter((col) => exportColumns.includes(String(col.key)))
        : columns;

      // Header
      const headers = columnsToExport.map((col) => col.label).join(",");

      // Rows
      const rows = sortedData
        .map((row) => {
          return columnsToExport
            .map((col) => {
              const value = row[col.key];
              // Escape valores com vírgulas/aspas
              const stringValue = String(value ?? "");
              if (stringValue.includes(",") || stringValue.includes('"')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
              }
              return stringValue;
            })
            .join(",");
        })
        .join("\n");

      const csv = `${headers}\n${rows}`;

      // Download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);

      setAnnounceMessage(
        `Arquivo CSV exportado com ${sortedData.length} ${sortedData.length === 1 ? "linha" : "linhas"}.`
      );
    },
    [columns, sortedData]
  );

  /**
   * Navegação por teclado
   */
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      const { focusedRow, focusedColumn } = keyboardState;
      const rowCount = sortedData.length;
      const colCount = columns.length;

      if (rowCount === 0) return;

      let newRow = focusedRow;
      let newCol = focusedColumn;
      let handled = false;

      switch (event.key) {
        case "ArrowDown":
          newRow = Math.min(focusedRow + 1, rowCount - 1);
          handled = true;
          break;

        case "ArrowUp":
          newRow = Math.max(focusedRow - 1, 0);
          handled = true;
          break;

        case "ArrowRight":
          newCol = Math.min(focusedColumn + 1, colCount - 1);
          handled = true;
          break;

        case "ArrowLeft":
          newCol = Math.max(focusedColumn - 1, 0);
          handled = true;
          break;

        case "PageDown":
          newRow = Math.min(focusedRow + 10, rowCount - 1);
          handled = true;
          break;

        case "PageUp":
          newRow = Math.max(focusedRow - 10, 0);
          handled = true;
          break;

        case "Home":
          if (event.ctrlKey) {
            newRow = 0;
            newCol = 0;
          } else {
            newCol = 0;
          }
          handled = true;
          break;

        case "End":
          if (event.ctrlKey) {
            newRow = rowCount - 1;
            newCol = colCount - 1;
          } else {
            newCol = colCount - 1;
          }
          handled = true;
          break;

        case "Enter":
        case " ":
          if (focusedRow >= 0 && focusedRow < rowCount) {
            const row = sortedData[focusedRow];
            if (row && event.key === "Enter" && onRowActivate) {
              onRowActivate(row);
            } else if (row && onRowClick) {
              onRowClick(row);
            }
            handled = true;
          }
          break;
      }

      if (handled) {
        event.preventDefault();
        setKeyboardState({ focusedRow: newRow, focusedColumn: newCol });

        // Scroll into view
        const rowElement = rowRefs.current.get(newRow);
        if (rowElement) {
          rowElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }

        // Anunciar navegação
        if (newRow !== focusedRow) {
          const row = sortedData[newRow];
          const firstCol = columns[0];
          if (row && firstCol) {
            const cellValue = row[firstCol.key];
            setAnnounceMessage(
              `Linha ${newRow + 1} de ${rowCount}. ${firstCol.label}: ${cellValue}`
            );
          }
        }
      }
    },
    [
      keyboardState,
      sortedData,
      columns,
      onRowClick,
      onRowActivate,
    ]
  );

  /**
   * Click em linha
   */
  const handleRowClick = React.useCallback(
    (row: T, index: number) => {
      setKeyboardState((prev) => ({ ...prev, focusedRow: index }));
      if (onRowClick) {
        onRowClick(row);
      }
    },
    [onRowClick]
  );

  /**
   * Focus no grid
   */
  const handleFocus = React.useCallback(() => {
    if (keyboardState.focusedRow === -1 && sortedData.length > 0) {
      setKeyboardState({ focusedRow: 0, focusedColumn: 0 });
    }
  }, [keyboardState.focusedRow, sortedData.length]);

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Live region para anúncios */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announceMessage}
      </div>

      {/* Error State */}
      {error && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-4"
          role="alert"
          data-testid="data-grid-error"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-red-900">
                {t.dataGrid.error}
              </p>
              <p className="text-sm text-red-700">
                {getErrorMessage(error)}
              </p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                {t.common.retry}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div
          className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-12"
          role="status"
          aria-live="polite"
          data-testid="data-grid-loading"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" aria-hidden="true" />
            <p className="text-sm text-gray-600">{t.dataGrid.loading}</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      {!isLoading && !error && (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={handleClearFilters}
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t.common.clear}
              >
                <X className="h-4 w-4" aria-hidden="true" />
                {t.common.clear} ({Object.keys(filters).length})
              </motion.button>
            )}
          </div>

          {exportable && sortedData.length > 0 && (
            <button
              onClick={() => handleExport()}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label={`Exportar ${sortedData.length} ${sortedData.length === 1 ? "linha" : "linhas"} para CSV`}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Exportar CSV
            </button>
          )}
        </div>
      )}

      {/* Grid Container */}
      {!isLoading && !error && (
        <div
        ref={gridRef}
        className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm"
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
      >
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "border-b border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-900",
                    column.width && `w-[${column.width}]`,
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right"
                  )}
                  style={column.width ? { width: column.width } : undefined}
                >
                  <div className="flex flex-col gap-2">
                    {/* Header com ordenação */}
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {sortable && column.sortable !== false && (
                        <button
                          onClick={() => handleSort(String(column.key))}
                          className="rounded p-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label={`Ordenar por ${column.label}`}
                          aria-sort={
                            sortState.column === String(column.key)
                              ? sortState.direction === "asc"
                                ? "ascending"
                                : "descending"
                              : "none"
                          }
                        >
                          {sortState.column === String(column.key) ? (
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                sortState.direction === "asc" && "rotate-180"
                              )}
                              aria-hidden="true"
                            />
                          ) : (
                            <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Filtro */}
                    {filterable && column.filterable !== false && (
                      <div className="relative">
                        <Search
                          className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
                          aria-hidden="true"
                        />
                        <input
                          type="text"
                          value={filters[String(column.key)] || ""}
                          onChange={(e) =>
                            handleFilter(String(column.key), e.target.value)
                          }
                          placeholder="Filtrar..."
                          className="w-full rounded border border-gray-300 bg-white py-1 pl-8 pr-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          aria-label={`Filtrar ${column.label}`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence mode="popLayout">
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Search className="h-12 w-12 text-gray-300" aria-hidden="true" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-700">
                          {emptyMessage || (
                            isNonEmpty(Object.keys(filters))
                              ? t.dataGrid.emptyFiltered
                              : t.dataGrid.emptyState
                          )}
                        </p>
                        {isNonEmpty(Object.keys(filters)) && (
                          <button
                            onClick={handleClearFilters}
                            className="text-xs text-blue-600 hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            {t.common.clear} {t.common.filter.toLowerCase()}
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData.map((row, rowIndex) => {
                  const isFocused = keyboardState.focusedRow === rowIndex;
                  return (
                    <motion.tr
                      key={String(row[rowKey])}
                      ref={(el) => {
                        if (el) rowRefs.current.set(rowIndex, el);
                      }}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => handleRowClick(row, rowIndex)}
                      className={cn(
                        "cursor-pointer border-b border-gray-100 transition-colors",
                        "hover:bg-blue-50",
                        isFocused &&
                          "bg-blue-100 ring-2 ring-inset ring-blue-500"
                      )}
                      role="row"
                      aria-rowindex={rowIndex + 2}
                      aria-selected={isFocused}
                      tabIndex={-1}
                    >
                      {columns.map((column, colIndex) => {
                        const value = row[column.key];
                        const isCellFocused =
                          isFocused && keyboardState.focusedColumn === colIndex;

                        return (
                          <td
                            key={String(column.key)}
                            className={cn(
                              "px-4 py-3 text-sm text-gray-900",
                              column.align === "center" && "text-center",
                              column.align === "right" && "text-right",
                              isCellFocused && "font-semibold"
                            )}
                            role="gridcell"
                          >
                            {column.render
                              ? column.render(value, row)
                              : String(value ?? "")}
                          </td>
                        );
                      })}
                    </motion.tr>
                  );
                })
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      )}

      {/* Footer com contagem */}
      {!isLoading && !error && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Exibindo {sortedData.length} de {data.length}{" "}
            {data.length === 1 ? "item" : "itens"}
          </div>
          {hasActiveFilters && (
            <div className="text-blue-600">
              {t.dataGrid.filterApplied(Object.keys(filters).length)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
