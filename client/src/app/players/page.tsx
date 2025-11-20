import type { Metadata } from "next";

import { Container } from "@/shared/Container";
import { PageHeading } from "@/shared/PageHeading";
import { Players } from "@/components/players/Players";
import { PlayersPagination } from "@/components/players";
import type { PageProps } from "@/app/types";

export const metadata: Metadata = {
  title: "Players",
  description: "Infromtaion about players",
};

export default async function PlayersPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;

  return (
    <>
      <div className="p-8">
        <Container>
          <PageHeading title="Players" />
          <Players page={page} />
          <PlayersPagination />
        </Container>
      </div>
    </>
  );
}
