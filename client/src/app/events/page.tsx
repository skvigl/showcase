import Link from "next/link";
import _ from "lodash";
import type { Metadata } from "next";

import { Container } from "@/shared/Container";
import { PageHeading } from "@/shared/PageHeading";
import { EventCard } from "@/components/events/EventCard";
import { fetcher } from "@/utils";
import { routes } from "@/routes";
import { API } from "@/api";
import type { Event } from "@/types";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Events",
  description: "Information about events",
};

export default async function EventsPage() {
  const events = await fetcher<Event[]>(API.events.many());

  return (
    <>
      <div className="p-8">
        <Container>
          <PageHeading title="Events" />
          <div className="grid grid-cols-4 gap-6">
            {_.map(events, (event) => {
              return (
                <Link key={event.id} href={routes.events.details(event.id)}>
                  <EventCard event={event} />
                </Link>
              );
            })}
          </div>
        </Container>
      </div>
    </>
  );
}
