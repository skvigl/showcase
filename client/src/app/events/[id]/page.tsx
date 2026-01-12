import { notFound } from "next/navigation";

import { Container } from "@/shared/Container";
import { Section } from "@/shared/Section";
import { EventLeaderboard } from "@/components/events/EventLeaderboard";
import { fetcher } from "@/utils";
import { API } from "@/api";
import type { Event, TeamWithPoints } from "@/types";
import type { PageProps } from "@/app/types";

export const revalidate = 60;
export async function generateStaticParams() {
  const events = await fetcher<Event[]>(API.events.many());

  if (!events) return [];

  return events.map((event) => ({
    id: event.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const event = await fetcher<Event>(API.events.one(id));

  if (!event) return null;

  return {
    title: `${event.name}`,
    description: `Information about ${event.name}`,
  };
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const event = await fetcher<Event>(API.events.one(id));
  const leaderboard = await fetcher<TeamWithPoints[]>(API.events.leaderboard(id));

  if (!event) {
    notFound();
  }

  return (
    <>
      <section className="p-8 py-20 bg-cyan-800 text-6xl text-white text-center">
        <Container>
          <h1 className="text-5xl">{event.name}</h1>
        </Container>
      </section>
      {leaderboard && (
        <Section className="max-w-[900px] mx-auto">
          <EventLeaderboard eventId={id} initialLeaderboard={leaderboard} />
        </Section>
      )}
    </>
  );
}
