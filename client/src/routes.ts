export const routes = {
  home: () => "/",
  events: {
    list: () => "/events",
    details: (id: string | number) => `/events/${id}`,
  },
  matches: {
    list: () => "/matches",
    details: (id: string | number) => `/matches/${id}`,
  },
  players: {
    list: () => "/players",
    details: (id: string | number) => `/players/${id}`,
  },
  teams: {
    list: () => "/teams",
    details: (id: string | number) => `/teams/${id}`,
  },
};
