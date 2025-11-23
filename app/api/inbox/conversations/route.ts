import { NextResponse } from "next/server";

import { getConversations } from "@/lib/inbox-service";

export const revalidate = 30;

export async function GET() {
  try {
    const conversations = await getConversations();
    return NextResponse.json(conversations, {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load conversations" }, { status: 500 });
  }
}
