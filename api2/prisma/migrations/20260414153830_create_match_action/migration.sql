-- CreateEnum
CREATE TYPE "MatchActionType" AS ENUM ('grab', 'move', 'steal', 'knockout', 'score');

-- CreateTable
CREATE TABLE "match_actions" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "tick" INTEGER NOT NULL,
    "type" "MatchActionType" NOT NULL,
    "actor_id" TEXT NOT NULL,
    "target_id" TEXT,
    "position" INTEGER NOT NULL,

    CONSTRAINT "match_actions_pkey" PRIMARY KEY ("id")
);


-- AddForeignKey
ALTER TABLE "match_actions" ADD CONSTRAINT "match_actions_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_actions" ADD CONSTRAINT "match_actions_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_actions" ADD CONSTRAINT "match_actions_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
