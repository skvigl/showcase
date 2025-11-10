import axios from "axios";

import { API_URL } from "../api.js";
import type { Player } from "../types/player.js";
import type { Team } from "../types/team.js";

export class TeamService {
  async getTeamPlayers(id: Team["id"]) {
    try {
      const res = await axios.get<Player[]>(`${API_URL}/teams/${id}/players`);

      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Can not get team players:", id, err.response?.data);
      }

      return [];
    }
  }
}
