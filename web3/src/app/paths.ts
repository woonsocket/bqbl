
export function getUsersPath() : string {
  return "/tmp/users";
};

export function getUserPath(uid: string) : string {
  return '/tmp/' + uid;
}

export function getLeaguesPath() : string {
  return '/tmp2/leagues';
}

export function getEventsPath() : string {
  return '/tmp2/events/';
}