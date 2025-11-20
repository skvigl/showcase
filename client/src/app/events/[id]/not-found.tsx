import { routes } from "@/routes";
import { PageNotFound } from "@/components/PageNotFound";

export default function NotFound() {
  return <PageNotFound subtitle="Could not find the requested event" backUrl={routes.events.list()} />;
}
