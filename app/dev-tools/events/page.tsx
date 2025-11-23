import { EventsDashboard } from '@/components/dev-tools/events-dashboard';

export const metadata = {
  title: 'Dev Tools · Events',
};

export default function EventsPage() {
  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6">
      <EventsDashboard />
    </main>
  );
}
