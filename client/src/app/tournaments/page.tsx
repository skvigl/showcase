import Link from "next/link";
import _ from "lodash";
import type { Metadata } from "next";

import { PageHeading } from "@/shared/PageHeading";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { fetcherSSR } from "@/utils";
import { routes } from "@/routes";
import { API } from "@/api";
import type { Tournament } from "@/types";
import type { PaginatedCollection } from "@/types/collection";
import { TOURNAMENT_ID } from "@/constants";
import { Section } from "@/shared/Section";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Tournaments",
  description: "Information about tournaments",
};

export default async function TournamentsPage() {
  const result = await fetcherSSR<PaginatedCollection<Tournament>>(API.tournaments.many());

  if (!result.ok) {
    return (
      <Section>
        <PageHeading title="Players" />
        <div>Tournaments not found</div>
      </Section>
    );
  }

  const { items: tournaments } = result.data;

  return (
    <>
      <Section>
        <PageHeading title="Tournaments" />
        <div className="grid lg:grid-cols-4 gap-6">
          {_.map(tournaments, (tournament) => {
            const isActive = tournament.id.toString() === TOURNAMENT_ID;

            return (
              <Link key={tournament.id} href={routes.tournaments.details(tournament.id)}>
                <TournamentCard tournament={tournament} isActive={isActive} />
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
}
