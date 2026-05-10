import { isAxiosError } from "axios";

import { axiosInstance } from "../utils.js";
import { MatchAction } from "../types/match-action.js";

export class MatchActionService {
  async create(action: MatchAction) {
    try {
      const res = await axiosInstance.post<{ data: MatchAction }>(`/match-actions/`, action);

      return res.data.data;
    } catch (err) {
      if (isAxiosError(err)) {
        console.log("Can not create match:", action.tick, err.response?.data);
      }
      return null;
    }
  }
}
