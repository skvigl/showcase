import { isAxiosError } from "axios";

import { Match } from "../types/match.js";
import { axiosInstance } from "../api.js";
import { env } from "../config.js";

export class MatchService {
  async getAll() {
    try {
      const res = await axiosInstance.get<{ items: Match[] }>(`/matches?tournamentId=${env.TOURNAMENT_ID}&pageSize=90`);

      return res.data.items;
    } catch (err) {
      if (isAxiosError(err)) {
        console.log("Can not get matches:", err.response?.data);
      }
      return [];
    }
  }

  async update(match: Match) {
    try {
      const res = await axiosInstance.patch<{ data: Match }>(`/matches/${match.id}`, {
        status: match.status,
        homeTeamScore: match.homeTeamScore,
        awayTeamScore: match.awayTeamScore,
        duration: match.duration,
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
