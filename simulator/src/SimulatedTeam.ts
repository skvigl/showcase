import type { Player } from "./types/player.js";

export interface ISimulatedTeam {
  getStrength: () => number;
}

export class SimulatedTeam implements ISimulatedTeam {
  private players: Player[];

  constructor(players: Player[]) {
    this.players = players;
  }

  getStrength() {
    return this.players.reduce((acc, cur) => acc + cur.power, 0);
  }
}
