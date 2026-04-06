import { Team } from './team';

export interface Match {
  id: string;
  eventId: string;
  date: string;
  status: 'scheduled' | 'live' | 'finished';
  homeTeamId: string | null;
  awayTeamId: string | null;
  homeTeamScore: number;
  awayTeamScore: number;
  createdAt: string;
  updatedAt: string;
  homeTeam?: Team;
  awayTeam?: Team;
}
