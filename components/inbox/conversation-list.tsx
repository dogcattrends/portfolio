"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export type InboxConversation = {
  id: string;
  phone: string;
  last_message_at: string;
  tags: string[];
  assigned_to: string | null;
  lastDirection: "in" | "out" | null;
  lastMessageId: string | null;
};

type ConversationListProps = {
  conversations: InboxConversation[];
  selectedId: string | null;
  onSelect: (conversationId: string) => void;
  onUpdateTags: (conversationId: string, tags: string[]) => Promise<void>;
  onHandoff: (conversationId: string, nextAssignee: string | null) => Promise<void>;
};

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  onUpdateTags,
  onHandoff,
}: ConversationListProps): JSX.Element {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-border/60 bg-card/80">
      <header className="border-b border-border/60 p-4">
        <p className="text-sm font-semibold text-muted-foreground">Conversas</p>
      </header>
      <ul className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            selected={selectedId === conversation.id}
            onSelect={onSelect}
            onUpdateTags={onUpdateTags}
            onHandoff={onHandoff}
          />
        ))}
        {conversations.length === 0 && (
          <li className="p-4 text-sm text-muted-foreground">Nenhuma conversa encontrada.</li>
        )}
      </ul>
    </div>
  );
}

function ConversationListItem({
  conversation,
  selected,
  onSelect,
  onUpdateTags,
  onHandoff,
}: {
  conversation: InboxConversation;
  selected: boolean;
  onSelect: (id: string) => void;
  onUpdateTags: (id: string, tags: string[]) => Promise<void>;
  onHandoff: (id: string, nextAssignee: string | null) => Promise<void>;
}): JSX.Element {
  const [tagsDraft, setTagsDraft] = useState(conversation.tags.join(", "));
  const isUnread = conversation.lastDirection === "in";
  const [isSavingTags, setIsSavingTags] = useState(false);
  const [isHandingOff, setIsHandingOff] = useState(false);

  const handleSaveTags = async () => {
    setIsSavingTags(true);
    const nextTags = tagsDraft
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    await onUpdateTags(conversation.id, nextTags);
    setIsSavingTags(false);
  };

  const handleHandoff = async () => {
    setIsHandingOff(true);
    const nextAssignee = conversation.assigned_to ? null : "support@portfolio.dev";
    await onHandoff(conversation.id, nextAssignee);
    setIsHandingOff(false);
  };

  return (
    <li
      className={`cursor-pointer border-b border-border/40 p-4 transition ${
        selected ? "bg-primary/5" : "hover:bg-muted/40"
      }`}
      onClick={() => onSelect(conversation.id)}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{conversation.phone}</p>
          <p className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("pt-BR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(new Date(conversation.last_message_at))}
          </p>
        </div>
        {isUnread && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Novo</span>}
      </div>
      <div className="mt-2">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">
          Tags
          <input
            type="text"
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-1 text-sm"
            value={tagsDraft}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => setTagsDraft(event.target.value)}
            onBlur={(event) => event.stopPropagation()}
          />
        </label>
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isSavingTags}
            onClick={(event) => {
              event.stopPropagation();
              void handleSaveTags();
            }}
          >
            {isSavingTags ? "Salvando..." : "Salvar"}
          </Button>
          <Button
            variant={conversation.assigned_to ? "ghost" : "secondary"}
            size="sm"
            disabled={isHandingOff}
            onClick={(event) => {
              event.stopPropagation();
              void handleHandoff();
            }}
          >
            {conversation.assigned_to ? "Liberar" : "Handoff"}
          </Button>
        </div>
      </div>
    </li>
  );
}
