import Link from "next/link";
import _ from "lodash";
import type { Metadata } from "next";

import { Container } from "@/shared/Container";
import { PageHeading } from "@/shared/PageHeading";
import { TeamCard } from "@/components/teams/TeamCard";
import { routes } from "@/routes";
import { fetcherSSR } from "@/utils";
import { API } from "@/api";
import type { PaginatedCollection } from "@/types/collection";
import type { Team } from "@/types";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Teams",
  description: "Information about teams",
};

export default async function TeamsPage() {
  const result = await fetcherSSR<PaginatedCollection<Team>>(API.teams.many());

  if (!result.ok) {
    return <div>No teams found</div>;
  }

  const { items: teams } = result.data;

  return (
    <>
      <div className="p-8">
        <Container>
          <PageHeading title="Teams" />
          <div className="grid lg:grid-cols-5 gap-6">
            {_.map(teams, (team) => {
              return (
                <Link key={team.id} href={routes.teams.details(team.id)}>
                  <TeamCard team={team} />
                </Link>
              );
            })}
          </div>
        </Container>
      </div>
    </>
  );
}
