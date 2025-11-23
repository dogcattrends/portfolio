'use client';

import { useEffect, useState } from 'react';
import { getAnalyticsEventHistory, subscribeToAnalyticsEvents, type AnalyticsEventRecord } from '@/lib/analytics/client';

export function EventsDashboard(): JSX.Element {
  const [events, setEvents] = useState<AnalyticsEventRecord[]>([]);

  useEffect(() => {
    setEvents(getAnalyticsEventHistory());
    return subscribeToAnalyticsEvents((event) => {
      setEvents((current) => [...current.slice(-199), event]);
    });
  }, []);

  return (
    <section className="rounded-3xl border border-border/60 bg-card/70 p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Dev Tools</p>
          <h1 className="text-3xl font-bold text-foreground">Analytics Events</h1>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-xs">
          Sessão atual: {events.length} eventos
        </span>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/30 text-left">
            <tr>
              <th className="px-4 py-2 font-semibold">Evento</th>
              <th className="px-4 py-2 font-semibold">Dados</th>
              <th className="px-4 py-2 font-semibold">Horário</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-4 py-2 font-semibold">{event.name}</td>
                <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                  {JSON.stringify(event.data)}
                </td>
                <td className="px-4 py-2 text-xs">
                  {new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'medium',
                  }).format(new Date(event.timestamp))}
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  Sem eventos registrados nesta sessão.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
