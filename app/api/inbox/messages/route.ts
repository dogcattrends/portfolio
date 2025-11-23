import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { createOutboundMessage } from "@/lib/inbox-service";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.conversationId || !body?.message) {
    return NextResponse.json({ error: "conversationId and message are required" }, { status: 400 });
  }

  try {
    const result = await createOutboundMessage(body.conversationId, body.message, body.mediaUrl);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
