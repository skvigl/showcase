-- CreateEnum
CREATE TYPE "MatchEventType" AS ENUM ('grab', 'move', 'steal', 'knockout', 'score');

-- CreateTable
CREATE TABLE "match_events" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "tick" INTEGER NOT NULL,
    "type" "MatchEventType" NOT NULL,
    "player_id" TEXT,
    "target_id" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "match_events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
