import type { Metadata } from "next";

import { MatchDetails } from "@/components/matches";
import type { PageProps } from "@/app/types";

export const metadata: Metadata = {
  title: `Match`,
  description: `Information about match`,
};

export default async function MatchDetailsPage({ params }: PageProps) {
  const { id } = await params;

  return <MatchDetails matchId={id} />;
}
