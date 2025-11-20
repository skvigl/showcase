import qs from "qs";

type QueryParams = Record<string, unknown>;

const withQuery = (pathname: string, query?: QueryParams) => {
  return query ? `${pathname}?${qs.stringify(query)}` : pathname;
};

export const API = {
  events: {
    many: () => "/api/v1/events",
    one: (id: string) => `/api/v1/events/${id}`,
    leaderboard: (id: string, query?: QueryParams) => withQuery(`/api/v1/events/${id}/leaderboard`, query),
    featuredMatches: (id: string, query?: QueryParams) => withQuery(`/api/v1/events/${id}/featured-matches`, query),
  },
  matches: {
    many: () => "/api/v1/matches",
    one: (id: string) => `/api/v1/matches/${id}`,
  },
  players: {
    many: (query?: QueryParams) => withQuery(`/api/v1/players`, query),
    one: (id: string) => `/api/v1/players/${id}`,
  },
  teams: {
    many: () => "/api/v1/teams",
    one: (id: string) => `/api/v1/teams/${id}`,
    players: (id: string) => `/api/v1/teams/${id}/players`,
    lastResults: (id: string) => `/api/v1/teams/${id}/last-results`,
    featuredMatches: (id: string, query?: QueryParams) => withQuery(`/api/v1/teams/${id}/featured-matches`, query),
  },
};
