import Link from "next/link";
import _ from "lodash";
import type { Metadata } from "next";

import { Container } from "@/shared/Container";
import { PageHeading } from "@/shared/PageHeading";
import { EventCard } from "@/components/events/EventCard";
import { fetcherSSR } from "@/utils";
import { routes } from "@/routes";
import { API } from "@/api";
import type { Event } from "@/types";
import type { PaginatedCollection } from "@/types/collection";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Events",
  description: "Information about events",
};

export default async function EventsPage() {
  const result = await fetcherSSR<PaginatedCollection<Event>>(API.events.many());

  if (!result.ok) {
    return "No events found";
  }

  const { items: events } = result.data;

  return (
    <>
      <div className="p-8">
        <Container>
          <PageHeading title="Events" />
          <div className="grid lg:grid-cols-4 gap-6">
            {_.map(events, (event) => {
              const isActive = event.id.toString() === process.env.NEXT_PUBLIC_ACTIVE_EVENT_ID;

              return (
                <Link key={event.id} href={routes.events.details(event.id)}>
                  <EventCard event={event} isActive={isActive} />
                </Link>
              );
            })}
          </div>
        </Container>
      </div>
    </>
  );
}
