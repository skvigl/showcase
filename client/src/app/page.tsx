import type { Metadata } from "next";

import { FeaturedMatches } from "@/components/matches";
import { EventTopTeams } from "@/components/events";
import { Container } from "@/shared/Container";
import { fetcher } from "@/utils";
import type { Match, TeamWithPoints } from "@/types";

const EVENT_ID = process.env.NEXT_PUBLIC_ACTIVE_EVENT_ID || "1";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Showcase - Fantasy soccer",
  description: "Showcase website by Maksim Kadomtsev",
};

export default async function HomePage() {
  const featuredMatches = await fetcher<Match[]>(`/api/v1/events/${EVENT_ID}/featured-matches?limit=6`);
  const topTeams = await fetcher<TeamWithPoints[]>(`/api/v1/events/${EVENT_ID}/leaderboard?limit=3`);

  return (
    <>
      <div className="px-8 py-16 bg-cyan-800 text-gray-50">
        <Container>
          <h1 className="mb-6 text-9xl font-medium text-center uppercase">Fantasy soccer</h1>
        </Container>
      </div>

      <FeaturedMatches eventId={EVENT_ID} initialFeaturedMatches={featuredMatches} />
      <EventTopTeams eventId={EVENT_ID} initialTopTeams={topTeams} />
    </>
  );
}
