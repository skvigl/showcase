"use client";

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import useSWR from "swr";

import { fetcher } from "@/utils";
import { Container } from "@/shared/Container";
import { Preloader } from "@/shared/Preloader";
import { routes } from "@/routes";
import type { Match, Event } from "@/types";

export const MatchDetails = ({ matchId }: { matchId: string }) => {
  const { data: match, isLoading } = useSWR<Match | null>(`/api/v1/matches/${matchId}`, fetcher);
  const { data: event } = useSWR<Event | null>(match ? `/api/v1/events/${match.eventId}` : null, fetcher);

  if (isLoading) {
    return <Preloader />;
  }

  if (!match) {
    return notFound();
  }

  const date = format(match.date, "dd.MM.yyyy");
  const time = format(match.date, "HH:mm");
  const isLive = match.status === "live";
  const isScheduled = match.status === "scheduled";
  const homeSrc = `/teams/${match.home.id}.svg`;
  const awaySrc = `/teams/${match.away.id}.svg`;

  return (
    <>
      <section className="p-16 bg-cyan-800 text-white">
        <Container>
          {event && <div className="mb-8 text-center">{event.name}</div>}
          {isLive && (
            <div className="grid place-items-center">
              <div className="inline-flex px-3 py-1 rounded border-2 border-white text-white bg-red-700 text-center font-medium uppercase">
                Live
              </div>
            </div>
          )}
          <div className="grid grid-cols-[1fr_200px_1fr]">
            <Link href={routes.teams.details(match.home.id)}>
              <div className="grid grid-cols-[1fr_auto] gap-4 justify-items-end items-center">
                <div className="text-4xl font-medium">{match.home.name}</div>
                <Image className="overflow-hidden w-20 h-20 rounded-full" src={homeSrc} width={80} height={80} alt="" />
              </div>
            </Link>
            <div className="grid grid-flow-col auto-cols-1fr items-center text-center">
              {isScheduled && (
                <>
                  <div></div>
                  <div>
                    <div className="text-lg font-bold">{date}</div>
                    <div className="font-medium">{time}</div>
                  </div>
                  <div></div>
                </>
              )}
              {!isScheduled && (
                <>
                  <div className="text-right text-4xl font-medium">{match.home.score}</div>
                  <div>
                    <div className="text-4xl font-bold">:</div>
                  </div>
                  <div className="text-left text-4xl font-medium">{match.away.score}</div>
                </>
              )}
            </div>
            <Link href={routes.teams.details(match.away.id)}>
              <div className="grid grid-cols-[auto_1fr] gap-4 justify-items-start items-center">
                <Image className="overflow-hidden w-20 h-20 rounded-full" src={awaySrc} width={80} height={80} alt="" />
                <div className="text-4xl font-medium">{match.away.name}</div>
              </div>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
};
