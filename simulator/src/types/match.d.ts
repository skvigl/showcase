import { Team } from "./team.ts";

export interface Match {
  id: string;
  eventId: number;
  date: string;
  status: "scheduled" | "live" | "finished";
  duration: number;
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeTeamScore: number;
  awayTeamScore: number;
  createdAt: string;
  updatedAt: string;
  homeTeam?: Team;
  awayTeam?: Team;
}
