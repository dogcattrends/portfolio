'use client';

import { useEffect } from 'react';
import { logAnalyticsEvent } from '@/lib/analytics/client';

type CaseViewTrackerProps = {
  slug: string;
  locale: string;
};

export function CaseViewTracker({ slug, locale }: CaseViewTrackerProps): null {
  useEffect(() => {
    logAnalyticsEvent('case_view', { slug, locale });
  }, [slug, locale]);

  return null;
}
