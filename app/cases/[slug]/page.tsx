import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseViewTracker } from "@/components/cases/case-view-tracker";
import { StructuredData } from "@/components/StructuredData";
import { getCaseDetail, getCaseBySlug, getCaseSlugs } from "@/lib/cases";
import {
  getCasesDictionary,
  resolveCasesLocale,
} from "@/lib/i18n/cases";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

type CasePageProps = {
  params: { slug: string };
  searchParams?: { lang?: string };
};

export async function generateStaticParams() {
  const slugs = await getCaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }: CasePageProps): Promise<Metadata> {
  const locale = resolveCasesLocale(searchParams?.lang);
  try {
    const caseData = await getCaseBySlug(locale, params.slug);
    const basePath = `/cases/${params.slug}`;
    const ptUrl = new URL(basePath, SITE_URL).toString();
    const enUrl = new URL(`${basePath}?lang=en`, SITE_URL).toString();
    const canonicalUrl = locale === "en" ? enUrl : ptUrl;
    const ogImage = new URL(
      `/api/og/case/${params.slug}${locale === "en" ? "?lang=en" : ""}`,
      SITE_URL,
    ).toString();

    return {
      title: `${caseData.title} | Cases`,
      description: caseData.summary,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          "pt-BR": ptUrl,
          "en-US": enUrl,
        },
      },
      openGraph: {
        title: caseData.title,
        description: caseData.summary,
        type: "article",
        url: canonicalUrl,
        images: [
          {
            url: ogImage,
            alt: `${caseData.title} KPIs`,
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: caseData.title,
        description: caseData.summary,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: "Case | Portfolio",
    };
  }
}

export default async function CasePage({ params, searchParams }: CasePageProps) {
  const locale = resolveCasesLocale(searchParams?.lang);
  const dictionary = getCasesDictionary(locale);
  try {
    const caseDetail = await getCaseDetail(locale, params.slug);
    const formattedDate = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "pt-BR", {
      dateStyle: "long",
    }).format(new Date(caseDetail.date));
    const basePath = `/cases/${caseDetail.slug}`;
    const ptUrl = new URL(basePath, SITE_URL).toString();
    const enUrl = new URL(`${basePath}?lang=en`, SITE_URL).toString();
    const canonicalUrl = locale === "en" ? enUrl : ptUrl;
    const articleStructuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: caseDetail.title,
      description: caseDetail.summary,
      image: `${SITE_URL}${caseDetail.cover}`,
      datePublished: caseDetail.date,
      dateModified: caseDetail.date,
      inLanguage: locale === "en" ? "en-US" : "pt-BR",
      author: {
        "@type": "Person",
        name: "Portfolio Lab",
      },
      publisher: {
        "@type": "Organization",
        name: "Portfolio Lab",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
        },
      },
      mainEntityOfPage: canonicalUrl,
      keywords: caseDetail.tags.join(", "),
      articleSection: caseDetail.industry,
      about: caseDetail.tags,
      mentions: caseDetail.metrics.map((metric) => ({
        "@type": "QuantitativeValue",
        name: metric.label,
        value: metric.value,
      })),
      isPartOf: {
        "@type": "CreativeWorkSeries",
        name: "Cases",
      },
    };

    return (
      <article className="space-y-10">
        <StructuredData data={articleStructuredData} id="case-article-jsonld" />
        <CaseViewTracker slug={caseDetail.slug} locale={locale} />
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href={locale === "en" ? "/?lang=en" : "/"}
                className="underline-offset-4 hover:underline"
              >
                {dictionary.breadcrumbHome}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={locale === "en" ? "/cases?lang=en" : "/cases"} className="underline-offset-4 hover:underline">
                {dictionary.breadcrumbCases}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-foreground">{caseDetail.title}</li>
          </ol>
        </nav>

        <header className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              {caseDetail.client} · {caseDetail.industry}
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{caseDetail.title}</h1>
            <p className="text-base text-muted-foreground">{caseDetail.summary}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{dictionary.readingTime(caseDetail.readingMinutes)}</span>
              <span aria-label={dictionary.publishedAt(formattedDate)}>{dictionary.publishedAt(formattedDate)}</span>
            </div>
            <Link
              href={locale === "en" ? "/cases?lang=en" : "/cases"}
              className="inline-flex items-center text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              ← {dictionary.backToCases}
            </Link>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border/60 shadow-lg">
            <Image
              src={caseDetail.cover}
              alt={caseDetail.title}
              width={800}
              height={500}
              className="h-full w-full object-cover"
            />
          </div>
        </header>

        <section
          aria-labelledby="metrics-heading"
          className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm"
        >
          <div className="mb-4">
            <h2 id="metrics-heading" className="text-xl font-semibold">
              {dictionary.metricsTitle}
            </h2>
            <p className="text-sm text-muted-foreground">{dictionary.relatedTagsLabel}</p>
          </div>
          <dl className="grid gap-4 md:grid-cols-3">
            {caseDetail.metrics.map((metric) => (
              <div key={`${caseDetail.slug}-${metric.label}`} className="rounded-2xl border border-border/70 p-4">
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">{metric.label}</dt>
                <dd className="text-2xl font-semibold">{metric.value}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-4 flex flex-wrap gap-2" aria-label={dictionary.relatedTagsLabel}>
            {caseDetail.tags.map((tag) => (
              <li key={`${caseDetail.slug}-${tag}`}>
                <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs">{tag}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          {caseDetail.content}
        </div>
      </article>
    );
  } catch {
    notFound();
  }
}
