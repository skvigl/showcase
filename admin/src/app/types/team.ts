import { Player } from './player';

export interface Team {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  players?: Player[];
}
