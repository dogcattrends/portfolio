"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { logAnalyticsEvent } from "@/lib/analytics/client";

const TEMPLATES = [
  "Olá! Estamos acompanhando seu pedido.",
  "Sua solicitação foi encaminhada ao time técnico.",
  "Podemos agendar uma chamada para detalhar o projeto?",
];

type MessageComposerProps = {
  conversationId: string | null;
  onSent: (message: string) => void;
};

export function MessageComposer({ conversationId, onSent }: MessageComposerProps): JSX.Element {
  const [message, setMessage] = useState("");
  const [template, setTemplate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!conversationId || !message.trim()) return;
    setSending(true);
    let mediaUrl: string | undefined;
    if (file) {
      mediaUrl = URL.createObjectURL(file);
    }

    await fetch("/api/inbox/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId, message, mediaUrl }),
    });
    setSending(false);
    setMessage("");
    setFile(null);
    onSent(message);
    logAnalyticsEvent("wa_message_send", {
      conversationId,
      hasMedia: Boolean(mediaUrl),
      length: message.length,
    });
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card/80 p-4">
      <div className="mb-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <label className="flex flex-col gap-1">
          Template
          <select
            className="rounded-lg border border-border bg-background px-2 py-1"
            value={template}
            onChange={(event) => {
              const value = event.target.value;
              setTemplate(value);
              if (value) setMessage(value);
            }}
          >
            <option value="">Escolher...</option>
            {TEMPLATES.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          Upload
          <input
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="text-xs"
          />
          {file ? <span className="text-xs text-foreground">{file.name}</span> : null}
        </label>
      </div>
      <textarea
            className="h-24 w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm"
            placeholder="Escreva uma mensagem..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={!conversationId}
      />
      <div className="mt-3 flex justify-end">
        <Button onClick={handleSend} disabled={!conversationId || sending || !message.trim()}>
          {sending ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </div>
  );
}
