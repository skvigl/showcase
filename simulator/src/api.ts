import axios from "axios";

import { env } from "./config.js";

// values in milliseconds
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;

export const axiosInstance = axios.create({
  baseURL: env.API_URL || "",
  headers: {
    "x-simulator-token": env.SIMULATOR_TOKEN,
  },
});
