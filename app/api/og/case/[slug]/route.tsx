import { ImageResponse } from "@vercel/og";
import { NextResponse } from "next/server";

import { getCaseBySlug } from "@/lib/cases";
import { resolveCasesLocale } from "@/lib/i18n/cases";

export const runtime = "nodejs";

type OgRouteParams = {
  params: { slug: string };
  request: Request;
};

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { searchParams } = new URL(request.url);
  const locale = resolveCasesLocale(searchParams.get("lang"));

  try {
    const caseData = await getCaseBySlug(locale, params.slug);
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "linear-gradient(135deg,#020617 20%,#0f172a 80%)",
            color: "#f8fafc",
            padding: "64px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          <div style={{ fontSize: 28, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.3em" }}>
            {caseData.client} · {caseData.industry}
          </div>
          <div>
            <h1 style={{ fontSize: 72, lineHeight: 1.1, marginBottom: 24 }}>{caseData.title}</h1>
            <p style={{ fontSize: 32, color: "#cbd5f5", maxWidth: "960px" }}>{caseData.summary}</p>
          </div>
          <div style={{ display: "flex", gap: "32px" }}>
            {caseData.metrics.slice(0, 3).map((metric) => (
              <div key={metric.label} style={{ fontSize: 28 }}>
                <div style={{ color: "#94a3b8", fontSize: 20, textTransform: "uppercase", letterSpacing: "0.15em" }}>
                  {metric.label}
                </div>
                <div style={{ fontSize: 48, fontWeight: 700 }}>{metric.value}</div>
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
}
