"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { format } from "date-fns";

import { fetcher } from "@/utils";
import { Container } from "@/shared/Container";
import { PageHeading } from "@/shared/PageHeading";
import { Section } from "@/shared/Section";
import { routes } from "@/routes";
import { API } from "@/api";
import { MatchCard } from "@/components/matches/MatchCard";
import { TOURNAMENT_ID } from "@/constants";
import { MINUTE } from "@/app/config/intervals";
import { Select } from "@/shared/Select";
import { Button } from "@/shared/ui/button";
import { buildWeeks } from "./utils";
import type { Tournament, Match, Team } from "@/types";
import type { PaginatedCollection } from "@/types/collection";

interface MatchesProps {
  teamsMap: Map<Team["id"], Team>;
  tournaments: Tournament[];
  initialMatchesResult: PaginatedCollection<Match>;
}

export const Matches: React.FC<MatchesProps> = ({ teamsMap, tournaments, initialMatchesResult }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string>(TOURNAMENT_ID);

  const { data: matchesResult, isValidating } = useSWR<PaginatedCollection<Match> | null>(
    API.matches.many({ tournamentId: selected, pageSize: 90 }),
    fetcher,
    {
      fallbackData: initialMatchesResult,
      refreshInterval: MINUTE,
    },
  );

  const weeks = useMemo(() => {
    const matches = matchesResult?.items ?? [];
    const tournament = tournaments.find((tr) => tr.id === selected);
    const tournamentStart = new Date(tournament ? tournament.startDate : Date.now());
    const tournamentEnd = new Date(tournament ? tournament.endDate : Date.now());

    return buildWeeks(tournamentStart, tournamentEnd, matches);
  }, [matchesResult, selected, tournaments]);

  const maxIndex = Math.max(0, weeks.length - 3);

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));

  const handleTournamentChange = (value: string) => {
    setSelected(value);
    setCurrentIndex(0);
  };

  const visibleWeeks = useMemo(() => {
    const visibleWeeks = [];

    for (let i = 0; i < 3; i++) {
      visibleWeeks.push(weeks[currentIndex + i] || null);
    }

    return visibleWeeks;
  }, [currentIndex, weeks]);

  return (
    <div className="py-8 h-full">
      <div className="px-8">
        <Container>
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <PageHeading title="Matches" />
            <Select
              className="justify-self-end"
              value={selected}
              options={tournaments.map((tr) => ({ label: tr.name, value: tr.id }))}
              onChange={handleTournamentChange}
            />
          </div>
        </Container>
      </div>
      <Section className={isValidating ? "opacity-10" : ""}>
        <div className="flex justify-center gap-8 mb-8">
          <Button
            className="cursor-pointer select-none"
            variant="secondary"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            Prev
          </Button>
          <Button
            className="cursor-pointer select-none"
            variant="secondary"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
          >
            Next
          </Button>
        </div>
        <div className="grid lg:grid-cols-3 gap-12">
          {visibleWeeks.map((week, i) => {
            if (week === null) {
              return <div key={i}></div>;
            }

            return (
              <div key={week.weekStart.toISOString()}>
                <h3 className="mb-4 text-lg font-medium text-center">
                  {format(week.weekStart, "dd.MM.yyyy")} – {format(week.weekEnd, "dd.MM.yyyy")}
                </h3>
                <div className="grid gap-4">
                  {week.matches.map((match) => {
                    const homeTeam = match.homeTeamId ? teamsMap.get(match.homeTeamId) : undefined;
                    const awayTeam = match.awayTeamId ? teamsMap.get(match.awayTeamId) : undefined;
                    const matchWithTeams = { ...match, homeTeam, awayTeam };

                    return (
                      <Link key={match.id} href={routes.matches.details(match.id)}>
                        <MatchCard match={matchWithTeams} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
};
