import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getCaseSummaries } from "@/lib/cases";
import { resolveCasesLocale } from "@/lib/i18n/cases";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = resolveCasesLocale(searchParams.get("lang"));
  try {
    const results = await getCaseSummaries(lang);
    return NextResponse.json(results, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load cases" }, { status: 500 });
  }
}
