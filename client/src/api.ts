import qs from "qs";

type QueryParams = Record<string, unknown>;

const withQuery = (pathname: string, query?: QueryParams) => {
  return query ? `${pathname}?${qs.stringify(query, { arrayFormat: "repeat" })}` : pathname;
};

const MAIN_API = process.env.NEXT_PUBLIC_MAIN_API_URL || "";
const STATS_API = process.env.NEXT_PUBLIC_STATS_API_URL || "";

export const API = {
  tournaments: {
    many: (query?: QueryParams) => withQuery(`${MAIN_API}/tournaments`, query),
    one: (id: string) => `${MAIN_API}/tournaments/${id}`,
    leaderboard: (id: string, query?: QueryParams) => withQuery(`${MAIN_API}/tournaments/${id}/leaderboard`, query),
    featuredMatches: (id: string, query?: QueryParams) =>
      withQuery(`${MAIN_API}/tournaments/${id}/featured-matches`, query),
  },
  matches: {
    many: (query?: QueryParams) => withQuery(`${MAIN_API}/matches`, query),
    one: (id: string, query?: QueryParams) => withQuery(`${MAIN_API}/matches/${id}`, query),
  },
  matchActions: {
    many: (query?: QueryParams) => withQuery(`${MAIN_API}/match-actions`, query),
  },
  players: {
    many: (query?: QueryParams) => withQuery(`${MAIN_API}/players`, query),
    one: (id: string, query?: QueryParams) => withQuery(`${MAIN_API}/players/${id}`, query),
    overviewStats: (id: string, query?: QueryParams) => withQuery(`${STATS_API}/players/${id}/overview`, query),
    matchStats: (id: string, query?: QueryParams) => withQuery(`${STATS_API}/players/${id}/match-stats`, query),
  },
  teams: {
    many: (query?: QueryParams) => withQuery(`${MAIN_API}/teams`, query),
    one: (id: string, query?: QueryParams) => withQuery(`${MAIN_API}/teams/${id}`, query),
    players: (id: string) => `${MAIN_API}/teams/${id}/players`,
    lastResults: (id: string, query?: QueryParams) => withQuery(`${MAIN_API}/teams/${id}/last-results`, query),
    featuredMatches: (id: string, query?: QueryParams) => withQuery(`${MAIN_API}/teams/${id}/featured-matches`, query),
  },
};
