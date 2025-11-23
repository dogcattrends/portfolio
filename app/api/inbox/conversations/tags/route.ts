import { NextRequest, NextResponse } from "next/server";
import { updateConversationTags } from "@/lib/inbox-service";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.conversationId) {
    return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
  }

  try {
    await updateConversationTags(body.conversationId, body.tags ?? []);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update tags" }, { status: 500 });
  }
}
