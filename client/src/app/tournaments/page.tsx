import Link from "next/link";
import _ from "lodash";
import type { Metadata } from "next";

import { Container } from "@/shared/Container";
import { PageHeading } from "@/shared/PageHeading";
import { TournamentCard } from "@/components/tournaments/TournamentCard";
import { fetcherSSR } from "@/utils";
import { routes } from "@/routes";
import { API } from "@/api";
import type { Tournament } from "@/types";
import type { PaginatedCollection } from "@/types/collection";
import { TOURNAMENT_ID } from "@/constants";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Tournaments",
  description: "Information about tournaments",
};

export default async function TournamentsPage() {
  const result = await fetcherSSR<PaginatedCollection<Tournament>>(API.tournaments.many());

  if (!result.ok) {
    return "No tournaments found";
  }

  const { items: tournaments } = result.data;

  return (
    <>
      <div className="p-8">
        <Container>
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
        </Container>
      </div>
    </>
  );
}
