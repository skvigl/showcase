import qs from "qs";

type QueryParams = Record<string, unknown>;

const withQuery = (pathname: string, query?: QueryParams) => {
  return query ? `${pathname}?${qs.stringify(query, { arrayFormat: "repeat" })}` : pathname;
};

const API_PREFIX = "";

export const API = {
  tournaments: {
    many: (query?: QueryParams) => withQuery(`${API_PREFIX}/tournaments`, query),
    one: (id: string) => `${API_PREFIX}/tournaments/${id}`,
    leaderboard: (id: string, query?: QueryParams) => withQuery(`${API_PREFIX}/tournaments/${id}/leaderboard`, query),
    featuredMatches: (id: string, query?: QueryParams) =>
      withQuery(`${API_PREFIX}/tournaments/${id}/featured-matches`, query),
  },
  matches: {
    many: (query?: QueryParams) => withQuery(`${API_PREFIX}/matches`, query),
    one: (id: string, query?: QueryParams) => withQuery(`${API_PREFIX}/matches/${id}`, query),
  },
  players: {
    many: (query?: QueryParams) => withQuery(`${API_PREFIX}/players`, query),
    one: (id: string, query?: QueryParams) => withQuery(`${API_PREFIX}/players/${id}`, query),
  },
  teams: {
    many: (query?: QueryParams) => withQuery(`${API_PREFIX}/teams`, query),
    one: (id: string, query?: QueryParams) => withQuery(`${API_PREFIX}/teams/${id}`, query),
    players: (id: string) => `${API_PREFIX}/teams/${id}/players`,
    lastResults: (id: string, query?: QueryParams) => withQuery(`${API_PREFIX}/teams/${id}/last-results`, query),
    featuredMatches: (id: string, query?: QueryParams) =>
      withQuery(`${API_PREFIX}/teams/${id}/featured-matches`, query),
  },
};
