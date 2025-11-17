import { Container } from "@/shared/Container";
import { Section } from "@/shared/Section";
import { EventLeaderboard } from "@/components/events/EventLeaderboard";
import { fetcher } from "@/utils";
import type { Event, TeamWithPoints } from "@/types";
import type { PageProps } from "@/app/types";

export const revalidate = 60;
export async function generateStaticParams() {
  const events = await fetcher<Event[]>("/api/v1/events");

  return events.map((event) => ({
    id: event.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const event = await fetcher<Event>(`/api/v1/events/${id}`);

  return {
    title: `${event.name}`,
    description: `Information about ${event.name}`,
  };
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const event = await fetcher<Event>(`/api/v1/events/${id}`);
  const leaderboard = await fetcher<TeamWithPoints[]>(`/api/v1/events/${id}/leaderboard`);

  return (
    <>
      <section className="p-8 py-20 bg-cyan-800 text-6xl text-white text-center">
        <Container>
          <h1>{event.name}</h1>
        </Container>
      </section>
      <Section className="max-w-2/5 mx-auto">
        <EventLeaderboard eventId={id} initialLeaderboard={leaderboard} />
      </Section>
    </>
  );
}
