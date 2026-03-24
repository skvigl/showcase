import type { Metadata } from "next";

import { PageHeading } from "@/shared/PageHeading";
import { Section } from "@/shared/Section";
import { Players } from "@/components/players/Players";
import { PlayersPagination } from "@/components/players";
import { API } from "@/api";
import { Player } from "@/types";
import { fetcherSSR } from "@/utils";
import type { PaginatedCollection } from "@/types/collection";
import type { PageProps } from "@/app/types";

export const metadata: Metadata = {
  title: "Players",
  description: "Infromtaion about players",
};

export default async function PlayersPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const pageNumber = Number(searchParams.page) || 1;

  const result = await fetcherSSR<PaginatedCollection<Player>>(API.players.many({ pageNumber, limit: 20 }));

  if (!result.ok || result.data.meta.totalPages < pageNumber) {
    return (
      <Section>
        <PageHeading title="Players" />
        <div>Players not found</div>
      </Section>
    );
  }

  const { meta, items } = result.data;

  return (
    <>
      <Section>
        <PageHeading title="Players" />
        <Players page={pageNumber} players={items} />
        <PlayersPagination pageSize={meta.pageSize} totalItems={meta.totalItems} />
      </Section>
    </>
  );
}
