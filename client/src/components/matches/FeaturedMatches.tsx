import Link from "next/link";
import _ from "lodash";

import { Section } from "@/shared/Section";
import { routes } from "@/routes";
import { MatchCard } from "./MatchCard";
import type { Match, Team } from "@/types";

interface FeaturedMatchesProps {
  teamsMap: Map<Team["id"], Team>;
  matches: Match[];
}

export const FeaturedMatches: React.FC<FeaturedMatchesProps> = ({ teamsMap, matches }) => {
  if (!matches) {
    return null;
  }

  return (
    <>
      <Section title="Featured Matches">
        <div className="grid lg:grid-cols-3 gap-6">
          {_.map(matches, (match) => {
            const matchWithTeams = {
              ...match,
              home: match.homeTeamId ? teamsMap.get(match.homeTeamId) : undefined,
              away: match.awayTeamId ? teamsMap.get(match.awayTeamId) : undefined,
            };

            return (
              <Link key={match.id} href={routes.matches.details(match.id)}>
                <MatchCard match={matchWithTeams} />
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
};
