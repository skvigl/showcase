import { isAxiosError } from "axios";

import { axiosInstance } from "../utils.js";
import type { Team } from "../types/team.js";

export class TeamService {
  async getTeamPlayers(id: Team["id"]) {
    try {
      const res = await axiosInstance.get<Team>(`/teams/${id}?include=players`);

      return res.data.players || [];
    } catch (err) {
      if (isAxiosError(err)) {
        console.log("Can not get team players:", id, err.response?.data);
      }

      return [];
    }
  }
}
