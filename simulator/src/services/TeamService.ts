import { isAxiosError } from "axios";

import { axiosInstance } from "../utils.js";
import type { Player } from "../types/player.js";
import type { Team } from "../types/team.js";

export class TeamService {
  async getTeamPlayers(id: Team["id"]) {
    try {
      const res = await axiosInstance.get<Player[]>(`/teams/${id}/players`);

      return res.data;
    } catch (err) {
      if (isAxiosError(err)) {
        console.log("Can not get team players:", id, err.response?.data);
      }

      return [];
    }
  }
}
