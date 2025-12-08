import { isAxiosError } from "axios";

import { Match } from "../types/match.js";
import { axiosInstance } from "../utils.js";

export class MatchService {
  async getAll() {
    try {
      const res = await axiosInstance.get<Match[]>(`/matches`);

      return res.data;
    } catch (err) {
      if (isAxiosError(err)) {
        console.log("Can not get matches:", err.response?.data);
      }
      return [];
    }
  }

  async update(match: Match) {
    try {
      const res = await axiosInstance.put<{ data: Match }>(`/matches/${match.id}`, {
        status: match.status,
        homeTeamScore: match.home.score,
        awayTeamScore: match.away.score,
      });

      return res.data.data;
    } catch (err) {
      if (isAxiosError(err)) {
        console.log("Can not update match:", match.id, err.response?.data);
      }
      return null;
    }
  }
}
