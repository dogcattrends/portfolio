import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getInventoryList, type InventoryStatus } from "@/lib/inventory-service";

export const revalidate = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    search: searchParams.get("search") ?? undefined,
    status: (searchParams.get("status") ?? undefined) as InventoryStatus | undefined,
    category: searchParams.get("category") ?? undefined,
    location: searchParams.get("location") ?? undefined,
    orgId: searchParams.get("org_id") ?? undefined,
  };

  try {
    const payload = await getInventoryList(filters);
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load inventory" },
      { status: 500 },
    );
  }
}
