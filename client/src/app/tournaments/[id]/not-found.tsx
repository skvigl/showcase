import { routes } from "@/routes";
import { PageNotFound } from "@/components/PageNotFound";

export default function NotFound() {
  return <PageNotFound subtitle="Could not find the requested tournament" backUrl={routes.tournaments.list()} />;
}
