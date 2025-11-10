export interface Match {
  id: number;
  eventId: number;
  date: string;
  status: "scheduled" | "live" | "finished";
  home: {
    id: number;
    name: string;
    score: number;
  };
  away: {
    id: number;
    name: string;
    score: number;
  };
}
