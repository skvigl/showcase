"use client";

import Link from "next/link";
import useSWR from "swr";
import _ from "lodash";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { Section } from "@/shared/Section";
import { cn } from "@/shared/utils";
import { MatchCard } from "@/components/matches/MatchCard";
import { fetcher } from "@/utils";
import { routes } from "@/routes";
import { API } from "@/api";
import type { TeamLastResult } from "@/types";

interface TeamLastResultsProps {
  teamId: string;
  initialTeamResults: TeamLastResult[];
}

export const TeamLastResults: React.FC<TeamLastResultsProps> = ({ teamId, initialTeamResults }) => {
  const { data: teamResults } = useSWR<TeamLastResult[] | null>(API.teams.lastResults(teamId), fetcher, {
    fallbackData: initialTeamResults,
    refreshInterval: 60000,
  });

  return (
    <>
      <Section title="Last Results">
        <div className="grid grid-flow-col auto-cols-min gap-2 font-medium">
          {_.map(teamResults, (tr) => {
            return (
              <Link key={tr.id} href={routes.matches.details(tr.id)}>
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      className={cn("cursor-pointer", {
                        "text-green-600": tr.result === "W",
                        "text-red-600": tr.result === "L",
                        "text-gray-600": tr.result === "D",
                      })}
                    >
                      {tr.result}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="p-0 bg-transparent">{<MatchCard match={tr} />}</TooltipContent>
                </Tooltip>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
};
