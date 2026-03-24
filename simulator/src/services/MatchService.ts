import { isAxiosError } from "axios";

import { Match } from "../types/match.js";
import { axiosInstance } from "../utils.js";

const activeEventId = process.env.ACTIVE_EVENT_ID || "1";

export class MatchService {
  async getAll() {
    try {
      const res = await axiosInstance.get<{ items: Match[] }>(`/matches?eventId=${activeEventId}&pageSize=90`);

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
      // console.log("try to update", match);
      return;

      const res = await axiosInstance.put<{ data: Match }>(`/matches/${match.id}`, {
        status: match.status,
        homeTeamScore: match.homeTeamScore,
        awayTeamScore: match.awayTeamScore,
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
