import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";

import { getLowStockReport } from "@/lib/inventory-service";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("org_id") ?? undefined;

  try {
    const payload = await getLowStockReport(orgId);
    return NextResponse.json(payload, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load report" }, { status: 500 });
  }
}
