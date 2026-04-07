import { notFound } from "next/navigation";

import { Container } from "@/shared/Container";
import { Section } from "@/shared/Section";
import { EventLeaderboard } from "@/components/events/EventLeaderboard";
import { fetcherSSR } from "@/utils";
import { API } from "@/api";
import type { Event, EventLeaderboard as TEventLeaderBoard } from "@/types";
import type { PageProps } from "@/app/types";
import type { PaginatedCollection } from "@/types/collection";

export const revalidate = 60;
export async function generateStaticParams() {
  const result = await fetcherSSR<PaginatedCollection<Event>>(API.events.many());

  if (!result.ok) return [];

  return result.data.items.map((event) => ({
    id: event.id.toString(),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const result = await fetcherSSR<Event>(API.events.one(id));

  if (!result.ok) return null;

  const event = result.data;

  return {
    title: `${event.name}`,
    description: `Information about ${event.name}`,
  };
}

export default async function EventDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const eventResult = await fetcherSSR<Event>(API.events.one(id));
  const leaderboardResult = await fetcherSSR<TEventLeaderBoard>(API.events.leaderboard(id));

  if (!eventResult.ok) {
    notFound();
  }

  const event = eventResult.data;

  return (
    <>
      <section className="p-8 py-20 bg-cyan-800 text-6xl text-white text-center">
        <Container>
          <h1 className="text-5xl">{event.name}</h1>
        </Container>
      </section>

      {leaderboardResult.ok && (
        <Section className="max-w-[800px] mx-auto">
          <EventLeaderboard eventId={id} initialLeaderboard={leaderboardResult.data} />
        </Section>
      )}
    </>
  );
}
