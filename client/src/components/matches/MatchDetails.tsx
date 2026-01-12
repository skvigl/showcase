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
import { API } from "@/api";
import type { Match, Event } from "@/types";

export const MatchDetails = ({ matchId }: { matchId: string }) => {
  const { data: match, isLoading } = useSWR<Match | null>(API.matches.one(matchId), fetcher);
  const { data: event } = useSWR<Event | null>(match ? API.events.one(match.eventId.toString()) : null, fetcher);

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
  const homeSrc = `/assets/teams/${match.home.id}.svg`;
  const awaySrc = `/assets/teams/${match.away.id}.svg`;

  return (
    <>
      <section className="p-6 lg:p-16 bg-cyan-800 text-white">
        <Container>
          {event && <div className="mb-8 text-center">{event.name}</div>}
          {isLive && (
            <div className="grid place-items-center">
              <div className="inline-flex px-3 py-1 rounded border-2 border-white text-white bg-red-700 text-center font-medium uppercase">
                Live
              </div>
            </div>
          )}
          <div className="grid lg:grid-cols-[1fr_160px_1fr] gap-6">
            <Link href={routes.teams.details(match.home.id)}>
              <div className="grid grid-flow-col lg:grid-cols-[1fr_auto] gap-4 justify-center items-center lg:justify-items-end">
                <div className="order-1 lg:order-2 overflow-hidden w-12 h-12 lg:w-20 lg:h-20 rounded-full">
                  <Image src={homeSrc} width={80} height={80} alt="" />
                </div>
                <div className="order-2 lg:order-1 text-3xl lg:text-4xl font-medium">{match.home.name}</div>
              </div>
            </Link>
            <div className="grid grid-flow-col auto-cols-max lg:auto-cols-1fr justify-center items-center text-center">
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
                  <div className="text-right text-5xl font-medium">{match.home.score}</div>
                  <div>
                    <div className="mx-3 text-4xl font-bold">:</div>
                  </div>
                  <div className="text-left text-5xl font-medium">{match.away.score}</div>
                </>
              )}
            </div>
            <Link href={routes.teams.details(match.away.id)}>
              <div className="grid grid-flow-col lg:grid-cols-[auto_1fr] gap-4 justify-center items-center lg:justify-items-start">
                <div className="overflow-hidden w-12 h-12 lg:w-20 lg:h-20 rounded-full">
                  <Image src={awaySrc} width={80} height={80} alt="" />
                </div>
                <div className="text-3xl lg:text-4xl font-medium">{match.away.name}</div>
              </div>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
};
