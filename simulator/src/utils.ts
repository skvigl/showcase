import axios from "axios";

// values in milliseconds
export const SECOND = 1000;
export const MINUTE = 60 * SECOND;

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST || "",
  headers: {
    "X-Simulator-Token": process.env.SIMULATOR_TOKEN,
  },
});
