import { isBefore } from "date-fns";

import { MatchService } from "./services/MatchService.js";
import { TeamService } from "./services/TeamService.js";
import { SimulatedTeam } from "./SimulatedTeam.js";
import { MINUTE } from "./utils.js";
import { SimulatedMatch } from "./SimulatedMatch.js";
import type { Match } from "./types/match.js";
import { MatchAction } from "./types/match-action.js";
import { MatchActionService } from "./services/MatchActionService.js";

export class Simulator {
  private liveMatches: Map<Match["id"], SimulatedMatch>;
  private scheduledMatches: Match[];

  constructor(
    private matchService: MatchService,
    private teamService: TeamService,
    private matchActionService: MatchActionService,
  ) {
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

    console.log(new Date(), "Synchronized");
  }

  async simulate() {
    const currentDate = new Date();
    const matches = this.scheduledMatches.filter((m) => {
      const matchDate = new Date(m.date);

      return currentDate.getTime() > matchDate.getTime() && !this.liveMatches.has(m.id);
    });

    if (matches.length > 0) {
      console.log(new Date(), `[SIMULATE] Found ${matches.length} matches to simulate`);
    }

    for (const match of matches) {
      if (!match.homeTeamId || !match.awayTeamId) {
        console.log(new Date(), "[SIMULATE] Can not simulate. All teams should be assigned to match");
        return;
      }

      const homePlayers = await this.teamService.getTeamPlayers(match.homeTeamId);
      const awayPlayers = await this.teamService.getTeamPlayers(match.awayTeamId);

      if (!homePlayers.length || !awayPlayers.length) {
        console.log(new Date(), "[SIMULATE] Can not simulate. No players found");
        return;
      }

      this.matchService.update({ ...match, status: "live" });

      const simulatedMatch = new SimulatedMatch(
        match,
        new SimulatedTeam(homePlayers),
        new SimulatedTeam(awayPlayers),
        40,
        (ma: MatchAction) => {
          this.matchActionService.create(ma);
        },
        (m: Match) => {
          this.matchService.update(m);
        },
        (m: Match) => {
          this.matchService.update(m);
          this.liveMatches.delete(m.id);
        },
      );

      this.liveMatches.set(match.id, simulatedMatch);
      simulatedMatch.start("live");
    }
  }

  async recoverMissedMatches() {
    const currentDate = new Date();
    const matches = this.scheduledMatches.filter((m) => isBefore(new Date(m.date), currentDate));

    if (matches.length === 0) {
      console.log(new Date(), "[RECOVER] Nothing to recover");
      return;
    }

    console.log(new Date(), `[RECOVER] Found ${matches.length} matches to recover`);

    for (const match of matches) {
      if (!match.homeTeamId || !match.awayTeamId) {
        console.log("[RECOVER] Can not simulate. All teams should be assigned to match");
        return;
      }

      const homePlayers = await this.teamService.getTeamPlayers(match.homeTeamId);
      const awayPlayers = await this.teamService.getTeamPlayers(match.awayTeamId);

      if (!homePlayers.length || !awayPlayers.length) {
        console.log("[RECOVER] Can not simulate. No players found");
        return;
      }

      const simulatedMatch = new SimulatedMatch(
        match,
        new SimulatedTeam(homePlayers),
        new SimulatedTeam(awayPlayers),
        40,
        (ma: MatchAction) => {
          this.matchActionService.create(ma);
        },
        (m: Match) => {},
        (m: Match) => {
          console.log(new Date(), "[RECOVER] FINISH", m.id);
          this.matchService.update(m);
          this.liveMatches.delete(m.id);
        },
      );

      this.liveMatches.set(match.id, simulatedMatch);
      simulatedMatch.start("fast");
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
