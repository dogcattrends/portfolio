"use client";

import { useMemo, useRef, useState, useEffect } from "react";

type MessageItem = {
  id: string;
  direction: "in" | "out";
  body: string | null;
  media_url: string | null;
  created_at: string;
};

type MessagePanelProps = {
  messages: MessageItem[];
  loading: boolean;
};

const ITEM_HEIGHT = 96;

export function MessagePanel({ messages, loading }: MessagePanelProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(520);

  useEffect(() => {
    if (!containerRef.current) return;
    setContainerHeight(containerRef.current.clientHeight);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({ top: containerRef.current.scrollHeight });
  }, [messages.length]);

  const totalHeight = messages.length * ITEM_HEIGHT;
  const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT) + 4;
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT));
  const endIndex = Math.min(messages.length, startIndex + visibleCount);
  const offsetY = startIndex * ITEM_HEIGHT;
  const visibleMessages = useMemo(() => messages.slice(startIndex, endIndex), [messages, startIndex, endIndex]);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-border/60 bg-card/80">
      <header className="border-b border-border/60 p-4">
        <p className="text-sm font-semibold text-muted-foreground">
          Mensagens {loading ? "(carregando...)" : ""}
        </p>
      </header>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        style={{ height: 520 }}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <div style={{ height: totalHeight, position: "relative" }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleMessages.map((message) => (
              <article
                key={message.id}
                className={`mx-4 mb-2 max-w-xl rounded-2xl px-4 py-3 text-sm shadow ${
                  message.direction === "out"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "mr-auto bg-muted text-foreground"
                }`}
              >
                <p>{message.body ?? (message.media_url ? "Arquivo enviado" : "")}</p>
                {message.media_url && (
                  <a
                    href={message.media_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex text-xs underline"
                  >
                    Abrir mídia
                  </a>
                )}
                <time className="mt-2 block text-xs opacity-70">
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(message.created_at))}
                </time>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
