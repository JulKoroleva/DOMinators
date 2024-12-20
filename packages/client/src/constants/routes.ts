export const ROUTES = {
  home: () => `/`,
  authorization: () => `/authorization`,
  registration: () => `/registration`,
  main: () => `/main`,
  game: () => `/game`,
  forum: () => `/forum`,
  profile: () => `/profile`,
  leaderboard: () => `/leaderboard`,
  error: (code: string | number = ':code') => `/error/${code}`,
  topic: (id?: number) => `/forum/${id || ':id'}`,
};
