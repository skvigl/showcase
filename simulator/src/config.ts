import { cleanEnv, str } from "envalid";

export const env = cleanEnv(process.env, {
  API_URL: str(),
  SIMULATOR_TOKEN: str(),
  TOURNAMENT_ID: str(),
  NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
});
