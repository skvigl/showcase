import axios from "axios";
import { API_URL } from "./api.js";

// values in milliseconds
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;

export const axiosInstance = axios.create({
  baseURL: API_URL || "",
  headers: {
    "X-Simulator-Token": process.env.SIMULATOR_TOKEN,
  },
});
