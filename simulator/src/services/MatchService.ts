import axios from "axios";

import { Match } from "../types/match.js";
import { API_URL } from "../api.js";

export class MatchService {
  async getAll() {
    try {
      const res = await axios.get<Match[]>(`${API_URL}/matches`);

      return res.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Can not get matches:", err.response?.data);
      }
      return [];
    }
  }

  async update(match: Match) {
    try {
      const res = await axios.put<{ data: Match }>(`${API_URL}/matches/${match.id}`, {
        status: match.status,
        homeTeamScore: match.home.score,
        awayTeamScore: match.away.score,
      });

      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Can not update match:", match.id, err.response?.data);
      }
      return null;
    }
  }
}
