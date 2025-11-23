import type { MetadataRoute } from "next";

import { getCaseSlugs } from "@/lib/cases";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getCaseSlugs();
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now },
    { url: `${SITE_URL}/cases`, lastModified: now },
  ];

  slugs.forEach((slug) => {
    routes.push({
      url: `${SITE_URL}/cases/${slug}`,
      lastModified: now,
    });
  });

  return routes;
}
