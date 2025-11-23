'use client';

import { track } from '@vercel/analytics';

export type AnalyticsEventName = 'case_view' | 'kpi_expand' | 'wa_message_send';

export type AnalyticsEventRecord = {
  id: string;
  name: AnalyticsEventName;
  data: Record<string, unknown>;
  timestamp: string;
};

type Listener = (event: AnalyticsEventRecord) => void;

const STORAGE_KEY = 'devtools:events';
const listeners = new Set<Listener>();

export function logAnalyticsEvent(name: AnalyticsEventName, data: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  try {
    track(name, data);
  } catch (error) {
    console.warn('Analytics track failed', error);
  }

  const event: AnalyticsEventRecord = {
    id: crypto.randomUUID(),
    name,
    data,
    timestamp: new Date().toISOString(),
  };

  const history = getAnalyticsEventHistory();
  history.push(event);
  const trimmed = history.slice(-200);
  window.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  listeners.forEach((listener) => listener(event));
}

export function getAnalyticsEventHistory(): AnalyticsEventRecord[] {
  if (typeof window === 'undefined') return [];
  const raw = window.sessionStorage?.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function subscribeToAnalyticsEvents(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
