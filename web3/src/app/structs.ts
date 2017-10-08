export class User {
  name: string;
  teams: TeamSpec[];
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
