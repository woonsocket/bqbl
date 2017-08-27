
export class User {
  name: string;
  teams: Team[];
  // TODO harveyj - make this a full-on league struct?
  leagueName: string;
  leagueId: string;
  weeks: {};
  dh: boolean;
}

export class Week {
  id: string;
  teams: Team[];
}

export class Team {
  name: string;
  selected: boolean;
}