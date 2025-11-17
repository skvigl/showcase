"use client";

import _ from "lodash";
import Link from "next/link";
import useSWR from "swr";

import { fetcher } from "@/utils";
import { Container } from "@/shared/Container";
import { PageHeading } from "@/shared/PageHeading";
import { Section } from "@/shared/Section";
import { Preloader } from "@/shared/Preloader";
import { routes } from "@/routes";
import { MatchCard } from "@/components/matches/MatchCard";
import type { Event, Match } from "@/types";

export default function MatchesPage() {
  const { data: events } = useSWR<Event[]>("/api/v1/events", fetcher);
  const { data: matches } = useSWR<Match[]>("/api/v1/matches", fetcher);

  if (!events || !matches) {
    return <Preloader />;
  }

  const matchesByEvent = _.groupBy(matches, "eventId");
  const eventsReverse = _.keys(matchesByEvent).reverse();

  return (
    <div className="py-8">
      <Container>
        <PageHeading title="Matches" />
      </Container>
      {eventsReverse.map((eventId) => {
        const event = _.find(events, (e) => e.id.toString() === eventId);
        const matches = _.sortBy(matchesByEvent[eventId], "date");

        if (!event) return null;

        return (
          <Section key={eventId} title={event.name}>
            <div className="grid grid-cols-3 gap-6">
              {_.map(matches, (match) => {
                return (
                  <Link key={match.id} href={routes.matches.details(match.id)}>
                    <MatchCard match={match} />
                  </Link>
                );
              })}
            </div>
          </Section>
        );
      })}
    </div>
  );
}
