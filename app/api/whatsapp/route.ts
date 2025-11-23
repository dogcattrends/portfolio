import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN && challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const messages = normalizeMessages(payload);
    if (messages.length === 0) {
      return NextResponse.json({ ok: true, message: "No actionable messages" });
    }

    const supabase = getServiceClient();
    for (const message of messages) {
      const { data: conversation, error: upsertError } = await supabase
        .from("conversations")
        .upsert(
          {
            id_ext: message.conversationExtId,
            phone: message.phone,
            last_message_at: message.timestamp,
          },
          { onConflict: "id_ext" },
        )
        .select("id")
        .single();

      if (upsertError || !conversation) {
        console.error("Conversation upsert failed", upsertError);
        continue;
      }

      const { error: messageError } = await supabase.from("messages").upsert(
        {
          id_ext: message.messageExtId,
          conversation_id: conversation.id,
          direction: message.direction,
          type: message.type,
          body: message.body,
          media_url: message.mediaUrl,
          status: message.status,
          created_at: message.timestamp,
        },
        { onConflict: "id_ext" },
      );

      if (messageError) {
        console.error("Message insert failed", messageError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}

type NormalizedMessage = {
  conversationExtId: string;
  phone: string;
  messageExtId: string;
  direction: "in" | "out";
  type: string;
  body: string;
  mediaUrl: string | null;
  status: string;
  timestamp: string;
};

function normalizeMessages(payload: any): NormalizedMessage[] {
  const entries = Array.isArray(payload?.entry) ? payload.entry : [];

  const result: NormalizedMessage[] = [];
  for (const entry of entries) {
    const changes = Array.isArray(entry?.changes) ? entry.changes : [];
    for (const change of changes) {
      const value = change?.value;
      if (!value) continue;

      const messages = Array.isArray(value.messages) ? value.messages : [];
      const contacts = Array.isArray(value.contacts) ? value.contacts : [];
      const contactPhone = contacts[0]?.wa_id ?? contacts[0]?.phone_number ?? value?.metadata?.display_phone_number;

      for (const message of messages) {
        const conversationId = message?.from ?? message?.to ?? value?.metadata?.phone_number_id ?? contactPhone;
        if (!conversationId) continue;
        const timestamp = message.timestamp
          ? new Date(Number(message.timestamp) * 1000).toISOString()
          : new Date().toISOString();

        const normalized: NormalizedMessage = {
          conversationExtId: conversationId,
          phone: contactPhone ?? conversationId,
          messageExtId: message.id ?? randomUUID(),
          direction: message.from ? "in" : "out",
          type: message.type ?? "unknown",
          body: extractBodyFromMessage(message),
          mediaUrl: extractMediaUrl(message),
          status: message.status ?? "received",
          timestamp,
        };
        result.push(normalized);
      }
    }
  }
  return result;
}

function extractBodyFromMessage(message: any): string {
  const type = message?.type;
  if (type === "text") {
    return message?.text?.body ?? "";
  }
  if (type === "image") {
    return message?.image?.caption ?? "";
  }
  if (type === "template") {
    return message?.template?.name ?? "template";
  }
  if (type === "interactive") {
    const interactive = message?.interactive;
    if (interactive?.type === "button_reply") {
      return interactive.button_reply?.title ?? "button_reply";
    }
    if (interactive?.type === "list_reply") {
      return interactive.list_reply?.title ?? "list_reply";
    }
  }
  if (type === "button") {
    return message?.button?.text ?? "button";
  }
  return typeof message?.[type] === "object" ? JSON.stringify(message[type]) : "";
}

function extractMediaUrl(message: any): string | null {
  if (message?.image?.link) return message.image.link;
  if (message?.document?.link) return message.document.link;
  if (message?.audio?.link) return message.audio.link;
  if (message?.video?.link) return message.video.link;
  return null;
}
