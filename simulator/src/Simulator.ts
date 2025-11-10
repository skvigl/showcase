import { isBefore, isToday } from "date-fns";

import { MatchService } from "./services/MatchService.js";
import { TeamService } from "./services/TeamService.js";
import { SimulatedMatch } from "./SimulatedMatch.js";
import { SimulatedTeam } from "./SimulatedTeam.js";
import { MINUTE } from "./utils.js";
import type { Match } from "./types/match.js";

export class Simulator {
  private liveMatches: Map<Match["id"], SimulatedMatch>;
  private scheduledMatches: Match[];

  constructor(private matchService: MatchService, private teamService: TeamService) {
    this.scheduledMatches = [];
    this.liveMatches = new Map();
  }

  async getMatches() {
    const matches = await this.matchService.getAll();

    return matches;
  }

  async synchronize() {
    const matches = await this.getMatches();
    this.scheduledMatches = matches.filter((m) => m.status === "scheduled");
  }

  async simulate() {

    const currentDate = new Date();
    const matches = this.scheduledMatches.filter((m) => {
      const matchDate = new Date(m.date);

      return (
        (isToday(new Date(m.date)) && currentDate.getTime() === matchDate.getTime()) ||
        (currentDate.getTime() > matchDate.getTime() && !this.liveMatches.has(m.id))
      );
    });

    for (const match of matches) {
      const homePlayers = await this.teamService.getTeamPlayers(match.home.id);
      const awayPlayers = await this.teamService.getTeamPlayers(match.away.id);

      if (!homePlayers.length || !awayPlayers.length) {
        console.log("Can not start match without players");
        return;
      }

      this.matchService.update({ ...match, status: "live" });

      const simulatedMatch = new SimulatedMatch(
        match,
        new SimulatedTeam(homePlayers),
        new SimulatedTeam(awayPlayers),
        40,
        (m: Match) => {
          this.matchService.update(m);
        },
        (m: Match) => {
          this.matchService.update(m);
          this.liveMatches.delete(m.id);
        }
      );
      simulatedMatch.start("live");
      this.liveMatches.set(match.id, simulatedMatch);
    }
  }

  async recoverMissedMatches() {
    const currentDate = new Date();
    const matches = this.scheduledMatches.filter((m) => isBefore(new Date(m.date), currentDate));


    for (const match of matches) {
      const homePlayers = await this.teamService.getTeamPlayers(match.home.id);
      const awayPlayers = await this.teamService.getTeamPlayers(match.away.id);

      if (!homePlayers.length || !awayPlayers.length) {
        console.log("Can not start match without players");
        return;
      }

      const simulatedMatch = new SimulatedMatch(
        match,
        new SimulatedTeam(homePlayers),
        new SimulatedTeam(awayPlayers),
        40,
        (m: Match) => {},
        (m: Match) => {
          this.matchService.update(m);
          this.liveMatches.delete(m.id);
        }
      );
      simulatedMatch.start("fast");
      this.liveMatches.set(match.id, simulatedMatch);
    }
  }

  async start() {
    await this.synchronize();
    await this.recoverMissedMatches();
    await this.simulate();

    setInterval(this.synchronize.bind(this), 15 * MINUTE);
    setInterval(this.simulate.bind(this), 1 * MINUTE);
  }
}
