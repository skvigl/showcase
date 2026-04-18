import { eachWeekOfInterval, endOfWeek, isWithinInterval } from "date-fns";
import { Match } from "@/types";

export function buildWeeks(tournamentStart: Date, tournamentEnd: Date, matches: Match[]) {
  const weekStarts = eachWeekOfInterval({ start: tournamentStart, end: tournamentEnd }, { weekStartsOn: 1 });
  const weeks = weekStarts.map((weekStart) => ({
    weekStart,
    weekEnd: endOfWeek(weekStart, { weekStartsOn: 1 }),
    matches: [] as Match[],
  }));

  for (const match of matches) {
    const date = new Date(match.date);

    const index = weekStarts.findIndex((weekStart) =>
      isWithinInterval(date, {
        start: weekStart,
        end: endOfWeek(weekStart, { weekStartsOn: 1 }),
      }),
    );

    if (index !== -1) {
      weeks[index].matches.push(match);
    }
  }

  return weeks.filter((week) => week.matches.length > 0);
}
