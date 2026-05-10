import { Player } from "./player.js";

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updateAt: string;
  players?: Player[];
}
