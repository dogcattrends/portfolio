import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { getInventoryDetail } from "@/lib/inventory-service";

export const revalidate = 60;

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const payload = await getInventoryDetail(params.id);
    return NextResponse.json(payload, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }
}
