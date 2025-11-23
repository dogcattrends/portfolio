import { NextResponse } from "next/server";

import { getMessages } from "@/lib/inbox-service";

export const revalidate = 15;

export async function GET(_request: Request, { params }: { params: { conversationId: string } }) {
  try {
    const messages = await getMessages(params.conversationId);
    return NextResponse.json(messages, {
      headers: { "Cache-Control": "s-maxage=15, stale-while-revalidate=45" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}
