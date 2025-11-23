import { randomUUID } from "crypto";

import { getServiceClient } from "@/lib/supabase/server";

export type ConversationRecord = {
  id: string;
  id_ext: string;
  phone: string;
  last_message_at: string;
  tags: string[];
  assigned_to: string | null;
};

export type MessageRecord = {
  id: string;
  id_ext: string;
  conversation_id: string;
  direction: "in" | "out";
  type: string;
  body: string | null;
  media_url: string | null;
  status: string | null;
  created_at: string;
};

export async function getConversations(): Promise<
  Array<
    ConversationRecord & {
      lastDirection: "in" | "out" | null;
      lastMessageId: string | null;
    }
  >
> {
  const client = getServiceClient();
  const { data: conversations, error } = await client
    .from<ConversationRecord>("conversations")
    .select("*")
    .order("last_message_at", { ascending: false });
  if (error) throw error;
  if (!conversations || conversations.length === 0) {
    return [];
  }

  const conversationIds = conversations.map((conversation) => conversation.id);
  const { data: recentMessages, error: messagesError } = await client
    .from<MessageRecord>("messages")
    .select("conversation_id,direction,created_at")
    .in("conversation_id", conversationIds)
    .order("created_at", { ascending: false });
  if (messagesError) throw messagesError;

  const latestMessageMap = new Map<string, { direction: "in" | "out"; id: string }>();
  if (recentMessages) {
    for (const message of recentMessages) {
      if (!latestMessageMap.has(message.conversation_id)) {
        latestMessageMap.set(message.conversation_id, {
          direction: message.direction,
          id: message.id,
        });
      }
    }
  }

  return conversations
    .map((conversation) => ({
      ...conversation,
      lastDirection: latestMessageMap.get(conversation.id)?.direction ?? null,
      lastMessageId: latestMessageMap.get(conversation.id)?.id ?? null,
    }))
    .sort((a, b) => {
      const aUnread = a.lastDirection === "in";
      const bUnread = b.lastDirection === "in";
      if (aUnread === bUnread) {
        return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime();
      }
      return aUnread ? -1 : 1;
    });
}

export async function getMessages(conversationId: string): Promise<MessageRecord[]> {
  const client = getServiceClient();
  const { data, error } = await client
    .from<MessageRecord>("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function updateConversationTags(conversationId: string, tags: string[]): Promise<void> {
  const client = getServiceClient();
  const { error } = await client
    .from("conversations")
    .update({ tags })
    .eq("id", conversationId);
  if (error) throw error;
}

export async function handoffConversation(conversationId: string, assignedTo: string | null): Promise<void> {
  const client = getServiceClient();
  const { error } = await client
    .from("conversations")
    .update({ assigned_to: assignedTo })
    .eq("id", conversationId);
  if (error) throw error;
}

export async function createOutboundMessage(conversationId: string, body: string, mediaUrl?: string): Promise<MessageRecord> {
  const client = getServiceClient();
  const message = {
    id_ext: randomUUID(),
    conversation_id: conversationId,
    direction: "out" as const,
    type: mediaUrl ? "media" : "text",
    body,
    media_url: mediaUrl ?? null,
    status: "sent",
  };

  const { data, error } = await client.from<MessageRecord>("messages").insert(message).select("*").single();
  if (error || !data) {
    throw error ?? new Error("Message insert failed");
  }

  await client
    .from("conversations")
    .update({ last_message_at: data.created_at })
    .eq("id", conversationId);

  return data;
}
