
export function getUsersPath(): string {
  return '/users';
}

export function getUserPath(uid: string): string {
  return '/users/' + uid;
}

export function getLeaguesPath(): string {
  return '/leagues/';
}

export function getEventsPath(): string {
  return '/events/';
}

export function getUnlockedWeeksPath(): string {
  return '/unlockedweeks/';
}

export function getScoresPath(year: string, week: string, team: string) : string {
  return `/scores/${year}/${week}/${team}`;
}