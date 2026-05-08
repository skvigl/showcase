import { Swords, Hand, Volleyball, Footprints, HandHelping, LucideIcon } from "lucide-react";

import { MatchActionType, Player } from "@/types";
import { GroupedMatchAction } from "./types";
import { cn } from "@/shared/utils";

interface MatchFeedActionProps {
  playersMap: Record<string, Player>;
  action: GroupedMatchAction;
  align: "left" | "right";
}

export const MatchFeedAction: React.FC<MatchFeedActionProps> = ({ playersMap, action, align }) => {
  const isRight = align === "right";
  const config = actionConfigMap[action.type];

  if (!config) return null;

  const Icon = config.icon;

  const actor = playersMap[action.actorId];
  const target = action.targetId ? playersMap[action.targetId] : null;

  const actorName = actor ? (
    <b key={`${actor.firstName}-${actor.lastName}`}>
      {actor.firstName} {actor.lastName}
    </b>
  ) : (
    "Unknown"
  );
  const targetName = target ? (
    <b key={`${target.firstName}-${target.lastName}`}>
      {target.firstName} {target.lastName}
    </b>
  ) : (
    "Unknown"
  );

  const message = config.getMessage({
    actor: actorName,
    target: targetName,
    position: action.toPos,
  });

  return (
    <div
      className={cn(
        "flex items-center gap-3 whitespace-nowrap",
        isRight ? "flex-row-reverse text-right" : "flex-row text-left",
      )}
    >
      <Icon size={18} className={`${config.color} shrink-0`} strokeWidth={2.5} />
      <span className="text-[13px] leading-tight text-slate-600">{message}</span>
    </div>
  );
};

type ActionConfig = {
  icon: LucideIcon;
  color: string;
  getMessage: (params: { actor: React.ReactNode; target?: React.ReactNode; position?: number }) => React.ReactNode[];
};

export const actionConfigMap: Record<MatchActionType, ActionConfig> = {
  score: {
    icon: Volleyball,
    color: "text-emerald-500 animate-bounce",
    getMessage: ({ actor }) => [actor, " spikes it for a point!"],
  },
  knockout: {
    icon: Swords,
    color: "text-red-500",
    getMessage: ({ actor, target }) => [actor, " smashed ", target, " — Knockout!"],
  },
  steal: {
    icon: Hand,
    color: "text-amber-500",
    getMessage: ({ actor, target }) => [actor, " dug the ball from ", target],
  },
  move: {
    icon: Footprints,
    color: "text-slate-400",
    getMessage: ({ actor, position }) => [actor, " pushes to ", position],
  },
  grab: {
    icon: HandHelping,
    color: "text-slate-500",
    getMessage: ({ actor }) => [actor, " picks up the ball"],
  },
} as const;
