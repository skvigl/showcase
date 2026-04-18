export const routes = {
  home: () => "/",
  tournaments: {
    list: () => "/tournaments",
    details: (id: string | number) => `/tournaments/${id}`,
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
