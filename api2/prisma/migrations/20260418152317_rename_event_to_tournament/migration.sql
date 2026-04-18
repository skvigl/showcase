ALTER TABLE "matches" DROP CONSTRAINT "matches_event_id_fkey";

ALTER TABLE "events" RENAME TO "tournaments";

ALTER TABLE "matches" RENAME COLUMN "event_id" TO "tournament_id";

ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "tournaments" RENAME CONSTRAINT "events_pkey" TO "tournaments_pkey";