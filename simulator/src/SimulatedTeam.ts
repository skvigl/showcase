import type { Player } from "./types/player.js";

export interface ISimulatedTeam {
  players: Player[];
  getRandomPlayer: () => Player;
  knockoutPlayer: (player: Player) => void;
  resetActivePlayers: () => void;
  hasPlayer: (player: Player) => boolean;
}

export class SimulatedTeam implements ISimulatedTeam {
  public readonly players: Player[];
  private activePlayers: Player[];

  constructor(players: Player[]) {
    this.players = players;
    this.activePlayers = players;
  }

  getRandomPlayer() {
    return this.activePlayers[Math.floor(Math.random() * this.activePlayers.length)];
  }

  knockoutPlayer(player: Player) {
    this.activePlayers = this.activePlayers.filter((p) => p.id !== player.id);
  }

  resetActivePlayers() {
    this.activePlayers = [...this.players];
  }

  hasPlayer(player: Player) {
    return this.players.some((p) => p.id === player.id);
  }
}
