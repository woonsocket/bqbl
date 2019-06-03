import { Time } from './structs';

export function getUsersPath(): string {
  return '/users';
}

export function getUserPath(uid: string): string {
  return '/users/' + uid;
}

export function getTempUserPath(uid: string): string {
  return '/tmp/users/' + uid;
}

export function getLeaguesPath(): string {
  return '/leagues/';
}

export function getEventsPath(t: Time): string {
  return `/events/${t.year}/${t.week}`;
}

export function getUnlockedWeeksPath(): string {
  return '/unlockedweeks';
}

export function getScoresPath(year: string, week?: string, team?: string): string {
  let retval = `/scores/${year}`;
  if (week) {
    retval += `/${week}`;
  }
  if (team) {
    retval += `/${team}`;
  }
  return retval;
}

export function get247ScoresPath(year: string): string {
  return `/scores247/${year}`;
}
