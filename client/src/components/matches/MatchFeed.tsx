import React, { useCallback, useMemo } from "react";

import { MatchFeedAction } from "./MatchFeedAction";
import { getHomePlayerIds, groupActions } from "./utils";
import { OVERTIME_TICK_THRESHOLD } from "./constants";
import { MatchAction, Player, Team } from "@/types";

interface MatchFeedProps {
  actions: MatchAction[];
  homeTeam: Team;
  awayTeam: Team;
}

export const MatchFeed: React.FC<MatchFeedProps> = ({ actions, homeTeam, awayTeam }) => {
  const groupedActions = useMemo(() => groupActions(actions), [actions]);

  const playersMap = useMemo(() => {
    const map: Record<string, Player> = {};
    [...(homeTeam.players ?? []), ...(awayTeam.players ?? [])].forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, [homeTeam, awayTeam]);

  const homePlayerIds = useMemo(() => getHomePlayerIds(homeTeam), [homeTeam]);

  const getSide = useCallback((playerId: string) => (homePlayerIds.has(playerId) ? "home" : "away"), [homePlayerIds]);

  return (
    <div>
      <div className="relative w-full max-w-2xl mx-auto py-10">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden sm:block" />

        <div className="space-y-4">
          {groupedActions.map((action, i) => {
            const side = getSide(action.actorId);
            const isLeft = side === "home";
            const isOvertime = action.tick === OVERTIME_TICK_THRESHOLD + 1;

            return (
              <React.Fragment key={action.id}>
                {isOvertime && (
                  <div className="relative flex justify-center my-8">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-dashed border-muted-foreground/50" />
                    </div>
                    <span className="relative px-4 bg-background text-xs font-black uppercase tracking-widest text-muted-foreground">
                      Overtime
                    </span>
                  </div>
                )}

                <div className={`relative flex items-center justify-between w-full sm:flex-row flex-col`}>
                  <div className="w-full sm:w-[42%] flex sm:justify-end justify-center order-2 sm:order-1">
                    {isLeft && <MatchFeedAction playersMap={playersMap} action={action} align="right" />}
                  </div>

                  <div className="relative z-10 my-2 sm:my-0 order-1 sm:order-2">
                    <div className="bg-background border px-2 py-1 rounded text-[10px] font-mono font-bold shadow-sm">
                      {action.tick}
                      {action.lastTick !== action.tick ? `-${action.lastTick}` : ""}
                    </div>
                  </div>

                  <div className="w-full sm:w-[42%] flex sm:justify-start justify-center order-3">
                    {!isLeft && <MatchFeedAction playersMap={playersMap} action={action} align="left" />}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
