export class User {
  name: string;
  teams: TeamSpec[];
  // TODO harveyj - make this a full-on league struct?
  leagueName: string;
  leagueId: string;
  weeks: Week[];
  dh: boolean;
}

export class Week {
  id: string;
  teams: TeamEntry[];
}

export class TeamEntry {
  name: string;
  selected: boolean;
}

export class TeamSpec {
  name: string;
}
